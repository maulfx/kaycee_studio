/**
 * Kaycee Studio Pro - Contracts Management Module
 */

import { saveStudioData } from './data.js';
import confetti from 'canvas-confetti';
import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';

let activeContractFilter = 'all';

/**
 * Render Contracts Management View
 */
export function renderContractsView(data, onAskAiContract, onShowToast) {
  const container = document.getElementById('contractsView');
  if (!container) return;

  const allContracts = data.contracts;

  // Filter based on status
  let filtered = allContracts.filter(c => {
    if (activeContractFilter === 'all') return true;
    return c.status === activeContractFilter;
  });

  // Calculate summary metrics
  const totalValue = allContracts.reduce((sum, c) => sum + (c.status !== 'draft' ? c.value : 0), 0);
  const activeCount = allContracts.filter(c => c.status === 'active').length;
  const pendingValue = allContracts
    .filter(c => c.status === 'pending' || c.status === 'review')
    .reduce((sum, c) => sum + c.value, 0);
  
  let totalDeliverables = 0;
  let completedDeliverables = 0;
  allContracts.forEach(c => {
    c.deliverables.forEach(d => {
      totalDeliverables++;
      if (d.done) completedDeliverables++;
    });
  });

  container.innerHTML = `
    <!-- Header -->
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Manajemen Kontrak & Kerjasama Brand
        </h2>
        <p>Kelola perjanjian sponsor, deliverables konten, termin pembayaran, dan klausul legal endorsement studio.</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-primary" id="btnCreateContract">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Buat Kontrak Baru
        </button>
      </div>
    </div>

    <!-- Contract Metric Summary -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Nilai Kontrak Portfolio</span>
          <div class="stat-icon-wrap stat-icon-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
        </div>
        <div class="stat-value">Rp ${(totalValue / 1000000).toLocaleString('id-ID')} Juta</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          5 Brand Aktif & Pipeline
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Kontrak Aktif Berjalan</span>
          <div class="stat-icon-wrap stat-icon-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div class="stat-value">${activeCount} Kontrak</div>
        <div class="stat-trend" style="color: var(--accent-cyan);">
          ASUS ROG & Moonton Official
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Menunggu Pembayaran / Review</span>
          <div class="stat-icon-wrap stat-icon-pink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="stat-value">Rp ${(pendingValue / 1000000).toLocaleString('id-ID')} Juta</div>
        <div class="stat-trend" style="color: var(--accent-pink);">
          Tokopedia Hub & Hoyoverse
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Progress Deliverables</span>
          <div class="stat-icon-wrap stat-icon-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
        </div>
        <div class="stat-value">${completedDeliverables} / ${totalDeliverables}</div>
        <div class="stat-trend trend-up">
          ${Math.round((completedDeliverables / (totalDeliverables || 1)) * 100)}% Selesai Tepat Waktu
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="content-toolbar">
      <div class="filter-pills">
        <button class="filter-pill ${activeContractFilter === 'all' ? 'active' : ''}" data-status="all">Semua Kontrak (${allContracts.length})</button>
        <button class="filter-pill ${activeContractFilter === 'active' ? 'active' : ''}" data-status="active">🟢 Sedang Aktif</button>
        <button class="filter-pill ${activeContractFilter === 'review' ? 'active' : ''}" data-status="review">🟡 Review Klausul</button>
        <button class="filter-pill ${activeContractFilter === 'pending' ? 'active' : ''}" data-status="pending">🔴 Menunggu Pelunasan</button>
        <button class="filter-pill ${activeContractFilter === 'completed' ? 'active' : ''}" data-status="completed">🟣 Selesai</button>
      </div>
    </div>

    <!-- Contracts Grid -->
    <div class="contract-grid">
      ${filtered.length === 0 ? `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-muted);">
          Tidak ada data kontrak pada status ini.
        </div>
      ` : filtered.map(contract => renderContractCard(contract)).join('')}
    </div>
  `;

  attachContractListeners(data, onAskAiContract, onShowToast);
}

/**
 * Render single contract card
 */
function renderContractCard(contract) {
  const statusLabelMap = {
    active: { label: 'Sedang Aktif', class: 'status-active' },
    review: { label: 'Review Klausul', class: 'status-review' },
    pending: { label: 'Menunggu Pelunasan', class: 'status-pending' },
    completed: { label: 'Selesai & Lunas', class: 'status-completed' },
    draft: { label: 'Draft', class: 'status-draft' }
  };

  const statusInfo = statusLabelMap[contract.status] || { label: contract.status, class: 'status-active' };
  const doneCount = contract.deliverables.filter(d => d.done).length;
  const totalCount = contract.deliverables.length;
  const pct = Math.round((doneCount / (totalCount || 1)) * 100);

  return `
    <div class="contract-card" data-contract-id="${contract.id}">
      <div class="contract-brand-header">
        <div class="brand-chip-group">
          <div class="brand-icon-box" style="background: ${contract.brandColor};">
            ${contract.brandInitial}
          </div>
          <div class="brand-info-wrap">
            <h4>${contract.brand}</h4>
            <span>${contract.category}</span>
          </div>
        </div>
        <span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>
      </div>

      <div class="contract-project-title">${contract.projectTitle}</div>

      <div class="contract-value-box">
        <div>
          <div class="contract-val-label">Nilai Kontrak</div>
          <div class="contract-val-amount">Rp ${contract.value.toLocaleString('id-ID')}</div>
        </div>
        <div style="text-align: right;">
          <div class="contract-val-label">Target Akun</div>
          <span class="code-pill" style="font-size: 11px;">${contract.targetAccount}</span>
        </div>
      </div>

      <!-- Deliverables Progress -->
      <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-muted); font-weight: 600;">
        <span>Progress Deliverables: ${doneCount}/${totalCount}</span>
        <span style="color: ${pct === 100 ? 'var(--accent-emerald)' : 'var(--accent-cyan)'};">${pct}%</span>
      </div>
      <div class="target-progress-bar" style="margin-bottom: 14px;">
        <div class="target-progress-fill" style="width: ${pct}%; background: ${pct === 100 ? 'var(--accent-emerald)' : 'var(--grad-tiktok)'};"></div>
      </div>

      <div class="deliverables-checklist">
        ${contract.deliverables.map(deliv => `
          <div class="deliv-item ${deliv.done ? 'completed' : ''}">
            <label class="deliv-check-label">
              <input type="checkbox" class="deliv-checkbox" data-contract-id="${contract.id}" data-deliv-id="${deliv.id}" ${deliv.done ? 'checked' : ''} />
              <span>${deliv.task}</span>
            </label>
          </div>
        `).join('')}
      </div>

      <div class="contract-footer">
        <div>
          <div style="color: var(--text-muted); font-size: 11px;">Periode Kontrak:</div>
          <div style="color: #fff; font-weight: 600;">${contract.startDate} - ${contract.endDate}</div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm btn-ask-ai-contract" data-contract-id="${contract.id}">
            🤖 AI
          </button>
          <button class="btn btn-secondary btn-sm btn-contract-invoice" data-contract-id="${contract.id}" title="Generate Invoice Resmi">
            🧾 Invoice
          </button>
          <button class="btn btn-outline-cyan btn-sm btn-contract-details" data-contract-id="${contract.id}">
            Klausul
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Event listeners for contracts
 */
function attachContractListeners(data, onAskAiContract, onShowToast) {
  // Status filter pills
  document.querySelectorAll('.filter-pill[data-status]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      playClickSound();
      activeContractFilter = e.target.dataset.status;
      renderContractsView(data, onAskAiContract, onShowToast);
    });
  });

  // Toggle deliverable checkbox
  document.querySelectorAll('.deliv-checkbox').forEach(chk => {
    chk.addEventListener('change', (e) => {
      playClickSound();
      const contractId = chk.dataset.contractId;
      const delivId = chk.dataset.delivId;

      const contract = data.contracts.find(c => c.id === contractId);
      if (contract) {
        const deliv = contract.deliverables.find(d => d.id === delivId);
        if (deliv) {
          deliv.done = chk.checked;
          saveStudioData(data);

          // Check if all are done
          const allDone = contract.deliverables.every(d => d.done);
          if (allDone && contract.status !== 'completed') {
            playSuccessSound();
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            if (onShowToast) onShowToast(`🎉 Semua deliverables untuk ${contract.brand} telah selesai!`);
          } else {
            if (onShowToast) onShowToast(`Deliverable diperbarui.`);
          }
          renderContractsView(data, onAskAiContract, onShowToast);
        }
      }
    });
  });

  // Invoice generator trigger
  document.querySelectorAll('.btn-contract-invoice').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.contractId;
      const contract = data.contracts.find(c => c.id === id);
      if (contract) showContractInvoiceModal(contract, onShowToast);
    });
  });

  // AI Review contract
  document.querySelectorAll('.btn-ask-ai-contract').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.contractId;
      const contract = data.contracts.find(c => c.id === id);
      if (contract && onAskAiContract) {
        onAskAiContract(contract);
      }
    });
  });

  // View Details Modal
  document.querySelectorAll('.btn-contract-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.contractId;
      const contract = data.contracts.find(c => c.id === id);
      if (contract) {
        showContractDetailModal(contract, data, onAskAiContract, onShowToast);
      }
    });
  });

  // Create Contract Button
  const btnCreate = document.getElementById('btnCreateContract');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      showCreateContractModal(data, onAskAiContract, onShowToast);
    });
  }
}

/**
 * Show Official Printable Studio Invoice Modal
 */
function showContractInvoiceModal(contract, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const invNum = 'INV-KC-' + contract.id.replace('ctr-', '').padStart(5, '0');
  const ppn = Math.round(contract.value * 0.11);
  const grandTotal = contract.value + ppn;

  modalTitle.textContent = `Invoice Resmi: ${invNum}`;
  modalBody.innerHTML = `
    <div class="invoice-sheet" id="printableInvoiceArea">
      <div class="invoice-top-header">
        <div>
          <div class="invoice-brand-title">KAYCEE STUDIO PRO</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Digital Creator & Esports Talent Management<br>
            Jakarta Selatan, DKI Jakarta 12430 | mgmt@kayceestudio.id
          </div>
        </div>
        <div style="text-align: right;">
          <div class="invoice-num-tag">${invNum}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Tanggal: 14 Okt 2026</div>
          <div style="font-size: 12px; color: var(--accent-pink); font-weight: 700;">Jatuh Tempo: ${contract.endDate}</div>
        </div>
      </div>

      <div class="invoice-meta-grid">
        <div class="invoice-meta-col">
          <h6>DITUJUKAN KEPADA (CLIENT / SPONSOR):</h6>
          <p>
            <b>${contract.brand}</b><br>
            Divisi Brand Partnership & Marketing<br>
            Proyek: ${contract.projectTitle}
          </p>
        </div>
        <div class="invoice-meta-col">
          <h6>TERMIN & STATUS:</h6>
          <p>
            <b>Status:</b> ${contract.paymentStatus}<br>
            <b>Target Platform:</b> TikTok (${contract.targetAccount})
          </p>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Deskripsi Konten & Deliverables</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Nilai (IDR)</th>
          </tr>
        </thead>
        <tbody>
          ${contract.deliverables.map(d => `
            <tr>
              <td>${d.task}</td>
              <td style="text-align: center; color: var(--accent-cyan); font-weight: 700;">1</td>
              <td style="text-align: right;">Termasuk</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="font-weight: 700; color: #fff;">Subtotal Jasa Kreator</td>
            <td style="text-align: right; font-weight: 700;">Rp ${contract.value.toLocaleString('id-ID')}</td>
          </tr>
          <tr>
            <td colspan="2" style="color: var(--text-muted);">PPN 11% (Faktur Pajak)</td>
            <td style="text-align: right; color: var(--text-muted);">Rp ${ppn.toLocaleString('id-ID')}</td>
          </tr>
        </tbody>
      </table>

      <div class="invoice-total-row">
        <div style="text-align: right;">
          <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted);">Total Tagihan Bersih:</div>
          <div class="invoice-total-val">Rp ${grandTotal.toLocaleString('id-ID')}</div>
        </div>
      </div>

      <div class="invoice-bank-box">
        <b style="color: #fff;">Informasi Pembayaran Transfer Bank:</b><br>
        Bank: <b>BCA (Bank Central Asia)</b> | No. Rekening: <b>872-049-2190</b><br>
        Atas Nama: <b>KAYCEE STUDIO KREASI DIGITAL</b> | Berita: <b>${invNum} ${contract.brand}</b>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
    <button class="btn btn-primary" id="btnPrintInvoice">🖨️ Cetak / Download Invoice</button>
  `;

  document.getElementById('btnPrintInvoice')?.addEventListener('click', () => {
    playClickSound();
    window.print();
    if (onShowToast) onShowToast(`Membuka dialog cetak invoice ${invNum}...`);
  });

  modal.classList.add('open');
}

/**
 * Show Contract Detail Modal
 */
function showContractDetailModal(contract, data, onAskAiContract, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = `Detail Kontrak: ${contract.brand}`;
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="font-size: 18px; font-weight: 800; color: #fff;">${contract.projectTitle}</h4>
        <span class="status-badge status-active">${contract.status.toUpperCase()}</span>
      </div>
      <p style="color: var(--text-secondary); font-size: 13px;">${contract.category} • Target Akun: <b>${contract.targetAccount}</b></p>
    </div>

    <div class="stat-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 20px;">
      <div class="stat-card" style="padding: 14px;">
        <span class="stat-label">Total Nilai Deal</span>
        <span class="stat-value" style="font-size: 22px; color: var(--accent-cyan);">Rp ${contract.value.toLocaleString('id-ID')}</span>
      </div>
      <div class="stat-card" style="padding: 14px;">
        <span class="stat-label">Status Pembayaran</span>
        <span class="stat-value" style="font-size: 15px; color: var(--accent-emerald); font-weight: 700; margin-top: 4px;">${contract.paymentStatus}</span>
      </div>
    </div>

    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <h5 style="color: #fff; font-weight: 700; margin-bottom: 10px; font-size: 13px;">Klausul Khusus & Catatan Legal:</h5>
      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">${contract.notes}</p>
    </div>

    <div class="form-group">
      <label class="form-label">Ubah Status Kontrak</label>
      <select class="form-control" id="updateContractStatusSelect">
        <option value="active" ${contract.status === 'active' ? 'selected' : ''}>Sedang Aktif Berjalan</option>
        <option value="review" ${contract.status === 'review' ? 'selected' : ''}>Sedang Review Klausul</option>
        <option value="pending" ${contract.status === 'pending' ? 'selected' : ''}>Menunggu Pembayaran / Pelunasan</option>
        <option value="completed" ${contract.status === 'completed' ? 'selected' : ''}>Selesai & Lunas</option>
      </select>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
    <button class="btn btn-primary" id="btnSaveContractStatus">Perbarui Status</button>
  `;

  const btnSave = document.getElementById('btnSaveContractStatus');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const newStatus = document.getElementById('updateContractStatusSelect').value;
      contract.status = newStatus;
      if (newStatus === 'completed') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      saveStudioData(data);
      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Status kontrak ${contract.brand} diperbarui menjadi ${newStatus}.`);
      renderContractsView(data, onAskAiContract, onShowToast);
    });
  }

  modal.classList.add('open');
}

/**
 * Show Modal to Create New Contract
 */
function showCreateContractModal(data, onAskAiContract, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = 'Buat Kontrak Kerjasama Brand Baru';
  modalBody.innerHTML = `
    <form id="createContractForm">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nama Brand / Client</label>
          <input type="text" class="form-control" id="newCtrBrand" placeholder="Contoh: SteelSeries ID" required />
        </div>
        <div class="form-group">
          <label class="form-label">Singkatan / Inisial Logo</label>
          <input type="text" class="form-control" id="newCtrInitial" placeholder="Contoh: SS" value="BR" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Judul Proyek / Kampanye</label>
        <input type="text" class="form-control" id="newCtrTitle" placeholder="Contoh: Arctis Nova 7 Gaming Headset Launch" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nilai Kontrak (Rupiah)</label>
          <input type="number" class="form-control" id="newCtrValue" placeholder="30000000" value="25000000" required />
        </div>
        <div class="form-group">
          <label class="form-label">Target Akun Creator</label>
          <select class="form-control" id="newCtrAccount">
            ${Object.values(data.accounts || {}).map(a => `<option value="${a.handle}">${a.handle} (${a.displayName})</option>`).join('')}
            <option value="all">Semua Akun (Bundle)</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tanggal Mulai</label>
          <input type="text" class="form-control" id="newCtrStart" value="15 Okt 2026" />
        </div>
        <div class="form-group">
          <label class="form-label">Tanggal Selesai / Deadline</label>
          <input type="text" class="form-control" id="newCtrEnd" value="30 Nov 2026" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Daftar Deliverables (Pisahkan per baris)</label>
        <textarea class="form-control" id="newCtrDeliverables" rows="3" placeholder="1 Dedicated Video TikTok 60 Detik&#10;1 IG Story Swipe-Up Link&#10;Live Stream Unboxing 2 Jam">1 Dedicated Video TikTok 60 Detik
1 Story Swipe Up Link
Live Stream Showcase 2 Jam</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Klausul / Pembayaran</label>
        <input type="text" class="form-control" id="newCtrNotes" value="DP 50% di awal sebelum shooting, pelunasan 50% setelah video tayang." />
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSubmitNewContract">Simpan Kontrak</button>
  `;

  const btnSubmit = document.getElementById('btnSubmitNewContract');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const brand = document.getElementById('newCtrBrand').value.trim();
      const title = document.getElementById('newCtrTitle').value.trim();
      const initial = document.getElementById('newCtrInitial').value.trim() || 'BR';
      const value = parseInt(document.getElementById('newCtrValue').value) || 10000000;
      const account = document.getElementById('newCtrAccount').value;
      const startDate = document.getElementById('newCtrStart').value.trim();
      const endDate = document.getElementById('newCtrEnd').value.trim();
      const notes = document.getElementById('newCtrNotes').value.trim();
      const rawDeliverables = document.getElementById('newCtrDeliverables').value.split('\n');

      if (!brand || !title) {
        alert('Mohon isi nama brand dan judul proyek.');
        return;
      }

      const deliverables = rawDeliverables
        .map(t => t.trim())
        .filter(Boolean)
        .map((task, idx) => ({ id: `d-new-${idx}`, task, done: false }));

      const newContract = {
        id: 'ctr-' + Date.now(),
        brand,
        brandColor: '#6366f1',
        brandInitial: initial.toUpperCase(),
        projectTitle: title,
        category: 'Brand Endorsement Deal',
        value,
        startDate: startDate || '15 Okt 2026',
        endDate: endDate || '15 Nov 2026',
        status: 'active',
        paymentStatus: 'DP 50% Menunggu Konfirmasi',
        targetAccount: account,
        deliverables,
        notes: notes || 'Standar SLA Kaycee Studio.'
      };

      data.contracts.unshift(newContract);
      saveStudioData(data);

      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Kontrak baru dengan ${brand} berhasil dibuat!`);
      renderContractsView(data, onAskAiContract, onShowToast);
    });
  }

  modal.classList.add('open');
}
