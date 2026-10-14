/**
 * Kaycee Studio Pro - Ads & Promo Management Module
 */

import { saveStudioData } from './data.js';

/**
 * Render Ads & Promo Section
 */
export function renderAdsPromoView(data, onAskAiPromo, onShowToast) {
  const container = document.getElementById('adsPromoView');
  if (!container) return;

  const adsData = data.adsPromo;
  const codes = adsData.codes || [];
  const pipeline = adsData.pipeline || [];

  // Calculate metrics
  const totalCommission = codes.reduce((sum, c) => sum + (c.commissionEarned || 0), 0);
  const totalGrossSales = codes.reduce((sum, c) => sum + (c.grossSales || 0), 0);
  const totalRedemptions = codes.reduce((sum, c) => sum + (c.uses || 0), 0);
  const activeCampaigns = pipeline.length;

  container.innerHTML = `
    <!-- Header -->
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
          Manajemen Kampanye Ads & Kode Promosi Affiliate
        </h2>
        <p>Pantau pipeline produksi konten berbayar, performa kode voucher diskon, dan omset konversi sponsor.</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-primary" id="btnCreateCampaign">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Kampanye Ads
        </button>
      </div>
    </div>

    <!-- Stat Grid -->
    <!-- Stat Grid -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Komisi Affiliate Masuk</span>
          <div class="stat-icon-wrap stat-icon-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="stat-value">${totalCommission > 0 ? 'Rp ' + (totalCommission / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'M' : 'Rp 0'}</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          ${codes.length > 0 ? '+42.8% Bulan ini' : 'Belum ada komisi'}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Omset Penjualan Brand</span>
          <div class="stat-icon-wrap stat-icon-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
        </div>
        <div class="stat-value">${totalGrossSales > 0 ? 'Rp ' + (totalGrossSales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'M' : 'Rp 0'}</div>
        <div class="stat-trend trend-up">
          Gross Merchandise Value (GMV)
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Checkout / Kode Digunakan</span>
          <div class="stat-icon-wrap stat-icon-pink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
        </div>
        <div class="stat-value">${totalRedemptions.toLocaleString()} Kali</div>
        <div class="stat-trend" style="color: var(--accent-pink);">
          ${codes.length > 0 ? 'Tingkat Konversi Aktif' : 'Belum ada transaksi'}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Kampanye Ads Aktif</span>
          <div class="stat-icon-wrap stat-icon-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
        </div>
        <div class="stat-value">${activeCampaigns} Proyek</div>
        <div class="stat-trend" style="color: var(--accent-purple);">
          Pipeline Produksi Studio
        </div>
      </div>
    </div>

    <!-- Production Pipeline Kanban -->
    <div style="margin-bottom: 32px;">
      <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M15 3v18"/></svg>
        Pipeline Produksi Konten Ads & Sponsor
      </h3>
      <div class="campaign-kanban-row">
        ${renderKanbanColumn('Scripting', '📝 Penulisan Script', pipeline.filter(p => p.stage === 'Scripting'), data, onAskAiPromo, onShowToast)}
        ${renderKanbanColumn('In Production', '🎬 Shooting & Edit', pipeline.filter(p => p.stage === 'In Production'), data, onAskAiPromo, onShowToast)}
        ${renderKanbanColumn('Client Review', '👀 Review Brand', pipeline.filter(p => p.stage === 'Client Review'), data, onAskAiPromo, onShowToast)}
        ${renderKanbanColumn('Live & Active', '🚀 Tayang & Optimasi', pipeline.filter(p => p.stage === 'Live & Active'), data, onAskAiPromo, onShowToast)}
      </div>
    </div>

    <!-- Promo Codes Performance Table -->
    <div class="glass-card">
      <div class="chart-header">
        <div class="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Tabel Performa Kode Promo & Affiliate Studio
        </div>
        <button class="btn btn-outline-cyan btn-sm" id="btnAddPromoCode">
          + Tambah Kode Promo
        </button>
      </div>

      <div class="data-table-wrap">
        <table class="studio-table">
          <thead>
            <tr>
              <th>Kode Voucher</th>
              <th>Mitra Brand</th>
              <th>Benefit Diskon</th>
              <th>Total Digunakan</th>
              <th>Gross GMV Terjual</th>
              <th>Komisi Creator</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${codes.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 40px 16px; color: var(--text-muted); font-size: 13px;">
                  Belum ada kode promo aktif. Klik "+ Tambah Kode Promo" untuk mencatat voucher atau link affiliate Anda.
                </td>
              </tr>
            ` : codes.map(code => `
              <tr>
                <td>
                  <span class="code-pill">${code.code}</span>
                </td>
                <td style="font-weight: 700; color: #fff;">${code.brand}</td>
                <td>${code.discount}</td>
                <td style="font-weight: 700; color: var(--accent-cyan);">${code.uses.toLocaleString()}x</td>
                <td>Rp ${code.grossSales.toLocaleString('id-ID')}</td>
                <td style="font-weight: 700; color: var(--accent-emerald);">Rp ${code.commissionEarned.toLocaleString('id-ID')} (${code.commissionRate})</td>
                <td>
                  <span class="status-badge ${code.status === 'Active' ? 'status-active' : 'status-draft'}">
                    ${code.status}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm btn-copy-code" data-code="${code.code}">
                    Salin Kode
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  attachAdsListeners(data, onAskAiPromo, onShowToast);
}

/**
 * Render single kanban column
 */
function renderKanbanColumn(stageId, title, items, data, onAskAiPromo, onShowToast) {
  return `
    <div class="kanban-col" data-stage="${stageId}">
      <div class="kanban-header">
        <span class="kanban-title">${title}</span>
        <span class="kanban-count">${items.length}</span>
      </div>
      <div class="kanban-cards-stack">
        ${items.length === 0 ? `
          <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 24px 0;">
            Tidak ada proyek
          </div>
        ` : items.map(item => `
          <div class="promo-card" data-pipe-id="${item.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <span class="code-pill" style="font-size: 10px;">${item.client}</span>
              <span class="status-badge ${item.priority === 'Urgent' ? 'status-pending' : 'status-review'}" style="font-size: 10px;">
                ${item.priority}
              </span>
            </div>
            <div style="font-weight: 700; color: #fff; font-size: 13px; margin-bottom: 6px; line-height: 1.35;">
              ${item.title}
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 10px;">
              <span>Target: ${item.targetDate}</span>
              <span style="color: var(--accent-cyan); font-weight: 700;">Rp ${(item.budget / 1000000).toFixed(0)}M</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Attach listeners for Ads view
 */
function attachAdsListeners(data, onAskAiPromo, onShowToast) {
  // Copy promo code
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      navigator.clipboard.writeText(code);
      if (onShowToast) onShowToast(`Kode "${code}" disalin ke clipboard!`);
    });
  });

  // Create Campaign Modal
  const btnCreateCampaign = document.getElementById('btnCreateCampaign');
  if (btnCreateCampaign) {
    btnCreateCampaign.addEventListener('click', () => {
      showCreateCampaignModal(data, onAskAiPromo, onShowToast);
    });
  }

  // Add Promo Code Modal
  const btnAddPromoCode = document.getElementById('btnAddPromoCode');
  if (btnAddPromoCode) {
    btnAddPromoCode.addEventListener('click', () => {
      showAddPromoCodeModal(data, onAskAiPromo, onShowToast);
    });
  }
}

/**
 * Modal to add new campaign in pipeline
 */
function showCreateCampaignModal(data, onAskAiPromo, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = 'Tambah Proyek Kampanye Ads Baru';
  modalBody.innerHTML = `
    <form id="createCampaignForm">
      <div class="form-group">
        <label class="form-label">Nama Client / Brand Sponsor</label>
        <input type="text" class="form-control" id="newCampClient" placeholder="Contoh: Logitech G, Razer, UniPin" required />
      </div>

      <div class="form-group">
        <label class="form-label">Judul Brief / Topik Konten</label>
        <input type="text" class="form-control" id="newCampTitle" placeholder="Contoh: Review Mouse Wireless 1K Hz..." required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Budget / Nilai Proyek (Rp)</label>
          <input type="number" class="form-control" id="newCampBudget" value="15000000" />
        </div>
        <div class="form-group">
          <label class="form-label">Prioritas</label>
          <select class="form-control" id="newCampPriority">
            <option value="High">Tinggi (High)</option>
            <option value="Urgent">Mendesak (Urgent)</option>
            <option value="Medium">Normal (Medium)</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tahap Pipeline</label>
          <select class="form-control" id="newCampStage">
            <option value="Scripting">Scripting</option>
            <option value="In Production">In Production</option>
            <option value="Client Review">Client Review</option>
            <option value="Live & Active">Live & Active</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target Tayang</label>
          <input type="text" class="form-control" id="newCampDate" value="25 Okt 2026" />
        </div>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSubmitNewCamp">Tambahkan ke Pipeline</button>
  `;

  const btnSubmit = document.getElementById('btnSubmitNewCamp');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const client = document.getElementById('newCampClient').value.trim();
      const title = document.getElementById('newCampTitle').value.trim();
      const budget = parseInt(document.getElementById('newCampBudget').value) || 10000000;
      const priority = document.getElementById('newCampPriority').value;
      const stage = document.getElementById('newCampStage').value;
      const targetDate = document.getElementById('newCampDate').value.trim();

      if (!client || !title) {
        alert('Mohon isi client dan judul kampanye.');
        return;
      }

      const newCamp = {
        id: 'pipe-' + Date.now(),
        stage,
        client,
        title,
        budget,
        targetDate: targetDate || 'Segera',
        priority
      };

      data.adsPromo.pipeline.unshift(newCamp);
      saveStudioData(data);

      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Kampanye "${client}" masuk ke pipeline ${stage}.`);
      renderAdsPromoView(data, onAskAiPromo, onShowToast);
    });
  }

  modal.classList.add('open');
}

/**
 * Modal to add new affiliate promo code
 */
function showAddPromoCodeModal(data, onAskAiPromo, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = 'Tambah Kode Voucher Promo Baru';
  modalBody.innerHTML = `
    <form id="addPromoCodeForm">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Kode Voucher</label>
          <input type="text" class="form-control" id="newCodeCode" placeholder="Contoh: KAYCEE50" required />
        </div>
        <div class="form-group">
          <label class="form-label">Nama Brand Mitra</label>
          <input type="text" class="form-control" id="newCodeBrand" placeholder="Contoh: Razer Indonesia" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Benefit / Diskon untuk Audiens</label>
        <input type="text" class="form-control" id="newCodeDiscount" placeholder="Contoh: Diskon 15% + Ongkir Gratis" value="Diskon 10%" />
      </div>

      <div class="form-group">
        <label class="form-label">Persentase Komisi Creator (%)</label>
        <input type="text" class="form-control" id="newCodeCommission" placeholder="Contoh: 10%" value="10%" />
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSubmitNewCode">Simpan Kode</button>
  `;

  const btnSubmit = document.getElementById('btnSubmitNewCode');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const code = document.getElementById('newCodeCode').value.trim().toUpperCase();
      const brand = document.getElementById('newCodeBrand').value.trim();
      const discount = document.getElementById('newCodeDiscount').value.trim();
      const commissionRate = document.getElementById('newCodeCommission').value.trim();

      if (!code || !brand) {
        alert('Mohon isi kode voucher dan brand.');
        return;
      }

      const newPromo = {
        id: 'promo-' + Date.now(),
        code,
        brand,
        discount: discount || 'Diskon Spesial',
        uses: 0,
        grossSales: 0,
        commissionRate: commissionRate || '10%',
        commissionEarned: 0,
        status: 'Active'
      };

      data.adsPromo.codes.unshift(newPromo);
      saveStudioData(data);

      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Kode promo "${code}" berhasil diaktifkan!`);
      renderAdsPromoView(data, onAskAiPromo, onShowToast);
    });
  }

  modal.classList.add('open');
}
