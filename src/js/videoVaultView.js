/**
 * Kaycee Studio - Video Vault Module (VideoFlow Style)
 * Production pipeline, video drafts, and rendering queue
 */

import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';
import { saveStudioData } from './data.js';

let videoSearchQuery = '';
let videoActiveFilter = 'all';

export function renderVideoVaultView(data, onShowToast, onStateChanged) {
  const container = document.getElementById('videoVaultView');
  if (!container) return;

  data.videoVault = data.videoVault || [];

  let list = data.videoVault;
  if (videoSearchQuery.trim()) {
    const q = videoSearchQuery.toLowerCase();
    list = list.filter(v => v.title.toLowerCase().includes(q) || v.fileName.toLowerCase().includes(q) || v.targetAccount.toLowerCase().includes(q));
  }
  if (videoActiveFilter !== 'all') {
    list = list.filter(v => v.status === videoActiveFilter);
  }

  container.innerHTML = `
    <!-- Header matching VideoFlow -->
    <div class="vf-posted-header">
      <div class="vf-header-left">
        <h2 class="vf-title">Video Vault</h2>
        <p class="vf-sub">Pustaka draft video, pipeline editing, dan antrian render</p>
      </div>

      <div class="vf-header-right">
        <div class="vf-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="videoVaultSearchInput" class="vf-search-input" placeholder="Cari draft video..." value="${videoSearchQuery}" />
        </div>

        <button class="btn vf-btn-primary" id="btnCreateNewVaultVideo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>+ Buat Draf Baru</span>
        </button>
      </div>
    </div>

    <!-- Subtitle Bar -->
    <div class="vf-sub-bar">
      <span class="vf-dot-live"></span>
      <span>Antrian produksi video lokal (Premiere Pro / After Effects)</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11.5px;">Total: <b>${list.length}</b> proyek</span>
    </div>

    <!-- Filters -->
    <div class="vf-filter-row">
      <button class="vf-filter-pill ${videoActiveFilter === 'all' ? 'active' : ''}" data-status-filter="all">Semua (${data.videoVault.length})</button>
      <button class="vf-filter-pill ${videoActiveFilter === 'Ready to Post' ? 'active' : ''}" data-status-filter="Ready to Post">🟢 Siap Tayang</button>
      <button class="vf-filter-pill ${videoActiveFilter === 'Client Review' ? 'active' : ''}" data-status-filter="Client Review">🟡 Review Klien</button>
      <button class="vf-filter-pill ${videoActiveFilter === 'Editing' ? 'active' : ''}" data-status-filter="Editing">🔵 Proses Edit</button>
      <button class="vf-filter-pill ${videoActiveFilter === 'Rendering' ? 'active' : ''}" data-status-filter="Rendering">🟣 Render</button>
    </div>

    <!-- Table Container -->
    <div class="vf-table-card">
      <table class="vf-table">
        <thead>
          <tr>
            <th style="width: 44%;">NAMA PROYEK & FILE</th>
            <th style="width: 12%;">RESOLUSI</th>
            <th style="width: 14%;">TARGET AKUN</th>
            <th style="width: 10%;">EDITOR</th>
            <th style="width: 10%;">STATUS</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${list.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 8px;">🎞️</div>
                <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px;">Belum Ada Proyek Video di Antrian</div>
                <div style="font-size: 12.5px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px; line-height: 1.5;">
                  Di sini Anda dapat melacak draft editing, render queue, dan status persetujuan klien. Klik tombol di bawah untuk membuat draft video baru.
                </div>
                <button class="btn vf-btn-primary" id="btnEmptyCreateVault">+ Buat Proyek Video Baru</button>
              </td>
            </tr>
          ` : list.map(item => `
            <tr class="vf-table-row">
              <td>
                <div style="font-weight: 600; color: #fff; font-size: 13.5px; margin-bottom: 3px;">${item.title}</div>
                <div class="vf-post-meta-sub">
                  <span class="vf-file-tag">${item.fileName}</span>
                  <span style="color: #64748b;">• ${item.duration}</span>
                  <span style="color: #94a3b8; font-size: 10.5px;">Cập nhật: ${item.updatedAt}</span>
                </div>
              </td>
              <td>
                <span class="vf-creator-pill" style="font-family: var(--font-mono); font-size: 11px;">${item.resolution}</span>
              </td>
              <td>
                <span class="vf-account-pill">${item.targetAccount}</span>
              </td>
              <td>
                <span style="font-size: 12px; color: #e2e8f0;">${item.assignedTo}</span>
              </td>
              <td>
                <span style="
                  display: inline-block;
                  padding: 3px 8px;
                  border-radius: 4px;
                  font-size: 11px;
                  font-weight: 600;
                  ${item.status === 'Ready to Post' ? 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);' : ''}
                  ${item.status === 'Client Review' ? 'background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);' : ''}
                  ${item.status === 'Editing' ? 'background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);' : ''}
                  ${item.status === 'Rendering' ? 'background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);' : ''}
                ">
                  ${item.status}
                </span>
              </td>
              <td>
                <div class="vf-actions-group">
                  <button class="btn-vf-action btn-vf-sync btn-publish-vault" data-id="${item.id}" title="Terbitkan ke Posted">Terbitkan</button>
                  <button class="btn-vf-action btn-vf-delete btn-delete-vault" data-id="${item.id}" title="Hapus Proyek">Hapus</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Search
  container.querySelector('#videoVaultSearchInput')?.addEventListener('input', (e) => {
    videoSearchQuery = e.target.value;
    renderVideoVaultView(data, onShowToast, onStateChanged);
  });

  // Filters
  container.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      videoActiveFilter = btn.dataset.statusFilter;
      renderVideoVaultView(data, onShowToast, onStateChanged);
    });
  });

  // Add new video project
  container.querySelector('#btnCreateNewVaultVideo')?.addEventListener('click', () => {
    playClickSound();
    const title = prompt('Nhập tên video dự án mới:');
    if (title && title.trim()) {
      data.videoVault.unshift({
        id: `vv-${Date.now()}`,
        title: title.trim(),
        fileName: `${title.trim().replace(/\s+/g, '_')}_v1.mp4`,
        duration: '0:30',
        resolution: '1080x1920 (9:16)',
        status: 'Editing',
        assignedTo: 'VaSTuan',
        targetAccount: '@kaycee.gaming',
        progress: 10,
        updatedAt: 'Vừa xong'
      });
      saveStudioData(data);
      playSuccessSound();
      if (onShowToast) onShowToast('Đã thêm dự án video mới vào kho!');
      renderVideoVaultView(data, onShowToast, onStateChanged);
      if (onStateChanged) onStateChanged();
    }
  });

  container.querySelector('#btnEmptyCreateVault')?.addEventListener('click', () => {
    container.querySelector('#btnCreateNewVaultVideo')?.click();
  });

  // Publish to posted
  container.querySelectorAll('.btn-publish-vault').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.id;
      const target = data.videoVault.find(v => v.id === id);
      if (target) {
        if (!data.videos) data.videos = [];
        data.videos.unshift({
          id: `post_${Date.now()}`,
          tiktokId: `${Date.now()}`,
          fileName: target.fileName,
          title: `#${target.title.replace(/\s+/g, '')} #kaycee #vastuan`,
          creator: target.assignedTo,
          accountId: 'acc_1',
          account: target.targetAccount,
          views: 1200,
          likes: 240,
          postDate: 'Vừa xong',
          cover: '/assets/avatar.jpg'
        });
        target.status = 'Ready to Post';
        saveStudioData(data);
        playChimeSound();
        if (onShowToast) onShowToast(`Đã xuất bản "${target.title}" sang mục Posted!`);
        renderVideoVaultView(data, onShowToast, onStateChanged);
        if (onStateChanged) onStateChanged();
      }
    });
  });

  // Delete
  container.querySelectorAll('.btn-delete-vault').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Xóa dự án video này khỏi hàng đợi?')) {
        data.videoVault = data.videoVault.filter(v => v.id !== id);
        saveStudioData(data);
        if (onShowToast) onShowToast('Đã xóa dự án.');
        renderVideoVaultView(data, onShowToast, onStateChanged);
        if (onStateChanged) onStateChanged();
      }
    });
  });
}
