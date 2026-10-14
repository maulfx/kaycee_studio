/**
 * Kaycee Studio - Source Assets Library (VideoFlow Style)
 * Raw footage, sound effects, audio tracks, and edit templates
 */

import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';
import { saveStudioData } from './data.js';

let sourceSearchQuery = '';
let sourceActiveFilter = 'all';

export function renderSourceView(data, onShowToast, onStateChanged) {
  const container = document.getElementById('sourceView');
  if (!container) return;

  data.sourceAssets = data.sourceAssets || [];

  let list = data.sourceAssets;
  if (sourceSearchQuery.trim()) {
    const q = sourceSearchQuery.toLowerCase();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q) || 
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (sourceActiveFilter !== 'all') {
    list = list.filter(item => item.category === sourceActiveFilter);
  }

  container.innerHTML = `
    <!-- Header matching VideoFlow -->
    <div class="vf-posted-header">
      <div class="vf-header-left">
        <h2 class="vf-title">Source Library</h2>
        <p class="vf-sub">Pustaka footage video, audio BGM, dan preset efek visual VFX</p>
      </div>

      <div class="vf-header-right">
        <div class="vf-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="sourceSearchInput" class="vf-search-input" placeholder="Cari nama aset, audio, atau tag..." value="${sourceSearchQuery}" />
        </div>

        <button class="btn vf-btn-primary" id="btnImportSource">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>+ Impor Aset Baru</span>
        </button>
      </div>
    </div>

    <!-- Subtitle Bar -->
    <div class="vf-sub-bar">
      <span class="vf-dot-live"></span>
      <span>Tersimpan di PC lokal untuk akses editing cepat</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11.5px;">Total: <b>${list.length}</b> aset</span>
    </div>

    <!-- Category Filters -->
    <div class="vf-filter-row">
      <button class="vf-filter-pill ${sourceActiveFilter === 'all' ? 'active' : ''}" data-cat-filter="all">Semua (${data.sourceAssets.length})</button>
      <button class="vf-filter-pill ${sourceActiveFilter === 'Footage' ? 'active' : ''}" data-cat-filter="Footage">🎬 Footage</button>
      <button class="vf-filter-pill ${sourceActiveFilter === 'Audio' ? 'active' : ''}" data-cat-filter="Audio">🎵 Audio / BGM</button>
      <button class="vf-filter-pill ${sourceActiveFilter === 'SFX' ? 'active' : ''}" data-cat-filter="SFX">🔊 SFX</button>
      <button class="vf-filter-pill ${sourceActiveFilter === 'VFX Presets' ? 'active' : ''}" data-cat-filter="VFX Presets">✨ VFX Presets</button>
      <button class="vf-filter-pill ${sourceActiveFilter === 'LUTs' ? 'active' : ''}" data-cat-filter="LUTs">🎨 LUTs</button>
    </div>

    <!-- Table Container -->
    <div class="vf-table-card">
      <table class="vf-table">
        <thead>
          <tr>
            <th style="width: 48%;">NAMA ASET / FILE</th>
            <th style="width: 12%;">KATEGORI</th>
            <th style="width: 12%;">FORMAT</th>
            <th style="width: 10%;">UKURAN</th>
            <th style="width: 10%;">TANGGAL</th>
            <th style="width: 8%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${list.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 8px;">📁</div>
                <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px;">Belum Ada File Sumber & Footage</div>
                <div style="font-size: 12.5px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px; line-height: 1.5;">
                  Simpan aset video thô, sound effects (SFX), background audio, dan preset After Effects di sini.
                </div>
                <button class="btn vf-btn-primary" id="btnEmptyAddSource">+ Tambah Aset Sumber</button>
              </td>
            </tr>
          ` : list.map(item => `
            <tr class="vf-table-row">
              <td>
                <div style="font-weight: 600; color: #fff; font-size: 13.5px; margin-bottom: 4px;">${item.name}</div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${item.tags.map(t => `<span class="vf-hashtag" style="font-size: 11px; background: rgba(56, 189, 248, 0.08); padding: 1px 6px; border-radius: 3px;">#${t}</span>`).join('')}
                </div>
              </td>
              <td>
                <span class="vf-creator-pill">${item.category}</span>
              </td>
              <td>
                <span class="vf-file-tag">${item.format}</span>
              </td>
              <td>
                <span style="font-size: 12px; font-weight: 600; color: #cbd5e1;">${item.size}</span>
              </td>
              <td>
                <span class="vf-date-text">${item.addedDate}</span>
              </td>
              <td>
                <div class="vf-actions-group">
                  <button class="btn-vf-action btn-vf-detail btn-use-source" data-id="${item.id}" title="Sử dụng tài nguyên này">Dùng</button>
                  <button class="btn-vf-action btn-vf-delete btn-delete-source" data-id="${item.id}" title="Xóa tài nguyên">Xóa</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Search
  container.querySelector('#sourceSearchInput')?.addEventListener('input', (e) => {
    sourceSearchQuery = e.target.value;
    renderSourceView(data, onShowToast, onStateChanged);
  });

  // Filter
  container.querySelectorAll('[data-cat-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      sourceActiveFilter = btn.dataset.catFilter;
      renderSourceView(data, onShowToast, onStateChanged);
    });
  });

  container.querySelector('#btnEmptyAddSource')?.addEventListener('click', () => {
    container.querySelector('#btnImportSource')?.click();
  });

  // Add source asset
  container.querySelector('#btnImportSource')?.addEventListener('click', () => {
    playClickSound();
    const name = prompt('Nhập tên tài nguyên / footage mới:');
    if (name && name.trim()) {
      data.sourceAssets.unshift({
        id: `src-${Date.now()}`,
        name: name.trim(),
        category: 'Footage',
        format: 'MP4 / 4K',
        size: '1.2 GB',
        tags: ['Custom', 'Footage'],
        downloads: 0,
        addedDate: 'Hôm nay'
      });
      saveStudioData(data);
      playSuccessSound();
      if (onShowToast) onShowToast('Đã nhập tài nguyên mới thành công!');
      renderSourceView(data, onShowToast, onStateChanged);
      if (onStateChanged) onStateChanged();
    }
  });

  // Use
  container.querySelectorAll('.btn-use-source').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.id;
      const target = data.sourceAssets.find(s => s.id === id);
      if (onShowToast) onShowToast(`Đã sao chép đường dẫn: ${target?.name}`);
    });
  });

  // Delete
  container.querySelectorAll('.btn-delete-source').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Xóa tài nguyên này khỏi thư viện?')) {
        data.sourceAssets = data.sourceAssets.filter(s => s.id !== id);
        saveStudioData(data);
        if (onShowToast) onShowToast('Đã xóa tài nguyên.');
        renderSourceView(data, onShowToast, onStateChanged);
        if (onStateChanged) onStateChanged();
      }
    });
  });
}
