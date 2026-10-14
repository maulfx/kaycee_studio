/**
 * Kaycee Studio - Posted View Module (VideoFlow Style)
 * Renders the exact published content table from the user reference
 */

import { saveStudioData } from './data.js';
import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';
import confetti from 'canvas-confetti';

let postedSearchQuery = '';
let postedActiveFilter = 'all';

/**
 * Format view numbers nicely (e.g. 72500 -> 72.5K)
 */
function formatViews(val) {
  if (!val || isNaN(val)) return '0';
  const num = Number(val);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Render the Posted View
 */
export function renderPostedView(data, onShowToast, onStateChanged) {
  const container = document.getElementById('postedView');
  if (!container) return;

  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);

  let videos = data.videos || [];

  // Filter by search
  if (postedSearchQuery.trim() !== '') {
    const q = postedSearchQuery.toLowerCase();
    videos = videos.filter(v => 
      (v.title && v.title.toLowerCase().includes(q)) ||
      (v.account && v.account.toLowerCase().includes(q)) ||
      (v.creator && v.creator.toLowerCase().includes(q)) ||
      (v.fileName && v.fileName.toLowerCase().includes(q)) ||
      (v.tiktokId && v.tiktokId.toLowerCase().includes(q))
    );
  }

  // Filter by account
  if (postedActiveFilter !== 'all') {
    videos = videos.filter(v => v.accountId === postedActiveFilter || v.account === postedActiveFilter);
  }

  container.innerHTML = `
    <!-- Top Sub-Header matching reference -->
    <div class="vf-posted-header">
      <div class="vf-header-left">
        <h2 class="vf-title">Posted</h2>
        <p class="vf-sub">Pustaka video publik Anda yang tersimpan di PC lokal</p>
      </div>

      <div class="vf-header-right">
        <div class="vf-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="postedSearchInput" class="vf-search-input" placeholder="Cari judul, tag, atau file..." value="${postedSearchQuery}" />
        </div>

        <button class="btn vf-btn-primary" id="btnAddPostedBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>+ Tambah Video</span>
        </button>
      </div>
    </div>

    <!-- Subtitle Bar -->
    <div class="vf-sub-bar">
      <span class="vf-dot-live"></span>
      <span>Daftar video publik yang tersimpan di PC ini (Penyimpanan Lokal)</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11.5px;">Total: <b>${videos.length}</b> video</span>
    </div>

    <!-- Filter Pills by Account -->
    ${accountsList.length > 1 ? `
      <div class="vf-filter-row">
        <button class="vf-filter-pill ${postedActiveFilter === 'all' ? 'active' : ''}" data-acc-filter="all">Tất cả tài khoản (${data.videos.length})</button>
        ${accountsList.map(acc => `
          <button class="vf-filter-pill ${postedActiveFilter === acc.id ? 'active' : ''}" data-acc-filter="${acc.id}">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${acc.accentColor || '#a855f7'}; margin-right: 5px;"></span>
            ${acc.handle}
          </button>
        `).join('')}
      </div>
    ` : ''}

    <!-- Table Container matching VideoFlow -->
    <div class="vf-table-card">
      <table class="vf-table">
        <thead>
          <tr>
            <th style="width: 48%;">POSTINGAN VIDEO</th>
            <th style="width: 10%;">KREATOR</th>
            <th style="width: 12%;">AKUN</th>
            <th style="width: 8%;">VIEWS</th>
            <th style="width: 12%;">TANGGAL PUBLISH</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${videos.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align: center; padding: 60px 16px; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 8px;">🎬</div>
                <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px;">Belum Ada Video Publik yang Dicatat</div>
                <div style="font-size: 12.5px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px; line-height: 1.5;">
                  Daftar video yang sudah Anda upload akan tersimpan dan tampil di tabel ini. Klik tombol di bawah untuk mencatat video pertama Anda.
                </div>
                <button class="btn vf-btn-primary" id="btnEmptyAddPost">+ Catat Video Pertama</button>
              </td>
            </tr>
          ` : videos.map(video => renderPostedRow(video, accounts)).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Search input handler
  const searchInput = document.getElementById('postedSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      postedSearchQuery = e.target.value;
      renderPostedView(data, onShowToast, onStateChanged);
    });
  }

  // Account filter pills
  document.querySelectorAll('[data-acc-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      postedActiveFilter = btn.dataset.accFilter;
      renderPostedView(data, onShowToast, onStateChanged);
    });
  });

  // Add post button
  document.getElementById('btnAddPostedBtn')?.addEventListener('click', () => {
    playClickSound();
    showAddPostedModal(data, () => {
      renderPostedView(data, onShowToast, onStateChanged);
      if (onStateChanged) onStateChanged();
    }, onShowToast);
  });

  document.getElementById('btnEmptyAddPost')?.addEventListener('click', () => {
    document.getElementById('btnAddPostedBtn')?.click();
  });

  // Action buttons
  container.querySelectorAll('.btn-vf-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.id;
      const target = data.videos.find(v => v.id === id);
      if (target) showPostedDetailModal(target);
    });
  });

  container.querySelectorAll('.btn-vf-sync').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.id;
      const target = data.videos.find(v => v.id === id);
      if (target) {
        // Simulate re-scanning views
        const boost = Math.floor(Math.random() * 800) + 120;
        target.views = (target.views || 1000) + boost;
        saveStudioData(data);
        playChimeSound();
        if (onShowToast) onShowToast(`Đã quét lại dữ liệu TikTok: +${boost} views!`);
        renderPostedView(data, onShowToast, onStateChanged);
      }
    });
  });

  container.querySelectorAll('.btn-vf-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const target = data.videos.find(v => v.id === id);
      if (confirm(`Bạn có chắc chắn muốn xóa bài đăng này?\n"${target?.title?.substring(0, 50)}..."`)) {
        data.videos = data.videos.filter(v => v.id !== id);
        saveStudioData(data);
        if (onShowToast) onShowToast('Đã xóa bài đăng thành công.');
        renderPostedView(data, onShowToast, onStateChanged);
        if (onStateChanged) onStateChanged();
      }
    });
  });
}

/**
 * Render single row in the table
 */
function renderPostedRow(video, accounts) {
  const acc = accounts[video.accountId] || {};
  const accountHandle = video.account || acc.handle || '@kaycee_vfx';
  const creator = video.creator || 'Kaycee';
  const tiktokId = video.tiktokId || video.id || '7688504918601272598';
  const fileName = video.fileName || video.sound || 'video_prob3.mp4';
  const coverImg = video.cover || '/assets/avatar.jpg';

  // Highlight hashtags
  const formattedTitle = (video.title || 'Untitled Post').replace(
    /(#\w+)/g, 
    '<span class="vf-hashtag">$1</span>'
  );

  return `
    <tr class="vf-table-row">
      <!-- Column 1: BÀI ĐĂNG -->
      <td>
        <div class="vf-post-cell">
          <div class="vf-thumb-box">
            <img src="${coverImg}" alt="Thumb" class="vf-thumb-img" onerror="this.src='/assets/avatar.jpg'" />
          </div>
          <div class="vf-post-info">
            <div class="vf-post-title" title="${video.title}">
              ${formattedTitle}
            </div>
            <div class="vf-post-meta-sub">
              <span class="vf-platform-tag">TikTok</span>
              <span class="vf-id-tag">: ${tiktokId}</span>
              <span class="vf-file-tag">${fileName}</span>
            </div>
          </div>
        </div>
      </td>

      <!-- Column 2: CREATOR -->
      <td>
        <span class="vf-creator-pill">${creator}</span>
      </td>

      <!-- Column 3: ACCOUNT -->
      <td>
        <span class="vf-account-pill">${accountHandle}</span>
      </td>

      <!-- Column 4: VIEWS -->
      <td>
        <span class="vf-views-num">${formatViews(video.views)}</span>
      </td>

      <!-- Column 5: NGÀY ĐĂNG -->
      <td>
        <span class="vf-date-text">${video.postDate || '20:12 24 thg 9, 2026'}</span>
      </td>

      <!-- Column 6: AKSI (3 Buttons) -->
      <td>
        <div class="vf-actions-group">
          <button class="btn-vf-action btn-vf-detail" data-id="${video.id}" title="Detail Video">Detail</button>
          <button class="btn-vf-action btn-vf-sync" data-id="${video.id}" title="Sync / Perbarui Views">Sync</button>
          <button class="btn-vf-action btn-vf-delete" data-id="${video.id}" title="Hapus Video">Hapus</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Show Modal to Add New Posted Video
 */
export function showAddPostedModal(data, onDone, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);

  modalTitle.textContent = '+ Catat Video Baru';
  modalBody.innerHTML = `
    <form id="addPostedForm">
      <div class="form-group">
        <label class="form-label">Judul Video / Caption TikTok</label>
        <textarea class="form-control" id="postTitle" rows="3" placeholder="#Highlight || Best gameplay MLBB / Valorant #gaming #kaycee" required></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">TikTok Video ID</label>
          <input type="text" class="form-control" id="postTikTokId" placeholder="7688504918601272598" value="${Date.now()}" />
        </div>
        <div class="form-group">
          <label class="form-label">Nama File Video / Export</label>
          <input type="text" class="form-control" id="postFileName" placeholder="video_clutch_final.mp4" value="Kaycee_Gameplay_Final.mp4" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Akun TikTok Tujuan</label>
          <select class="form-control" id="postAccountId">
            ${accountsList.length ? accountsList.map(a => `<option value="${a.id}">${a.handle} (${a.displayName})</option>`).join('') : `
              <option value="acc_1">@kaycee.gaming</option>
              <option value="acc_2">@kaycee.lifestyle</option>
            `}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Kreator / Editor</label>
          <input type="text" class="form-control" id="postCreator" value="Kaycee" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Jumlah Views Awal</label>
          <input type="number" class="form-control" id="postViews" placeholder="0" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label">Thumbnail Cover</label>
          <input type="text" class="form-control" id="postCover" value="/assets/avatar.jpg" />
        </div>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn vf-btn-primary" id="btnSubmitNewPosted">Simpan Video</button>
  `;

  document.getElementById('btnSubmitNewPosted')?.addEventListener('click', () => {
    const title = document.getElementById('postTitle')?.value.trim();
    if (!title) {
      alert('Silakan masukkan judul atau caption video.');
      return;
    }

    const accountId = document.getElementById('postAccountId')?.value;
    const targetAcc = accounts[accountId] || accountsList[0] || { handle: '@kaycee.gaming' };
    const views = parseInt(document.getElementById('postViews')?.value) || 0;

    const newPost = {
      id: document.getElementById('postTikTokId')?.value.trim() || String(Date.now()),
      tiktokId: document.getElementById('postTikTokId')?.value.trim() || String(Date.now()),
      fileName: document.getElementById('postFileName')?.value.trim() || 'video_final.mp4',
      title,
      creator: document.getElementById('postCreator')?.value.trim() || 'Kaycee',
      accountId: targetAcc.id || accountId,
      account: targetAcc.handle || '@kaycee.gaming',
      views,
      likes: Math.round(views * 0.14),
      comments: Math.round(views * 0.006),
      shares: Math.round(views * 0.012),
      postDate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('id-ID'),
      cover: document.getElementById('postCover')?.value.trim() || '/assets/avatar.jpg'
    };

    if (!data.videos) data.videos = [];
    data.videos.unshift(newPost);
    saveStudioData(data);

    playSuccessSound();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    modal.classList.remove('open');
    if (onShowToast) onShowToast('Video baru berhasil dicatat!');
    if (onDone) onDone();
  });

  modal.classList.add('open');
}

/**
 * Show Video Detail Modal
 */
function showPostedDetailModal(video) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = `Chi tiết bài đăng: ${video.account}`;
  modalBody.innerHTML = `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="width: 140px; height: 190px; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid var(--border-subtle); flex-shrink: 0;">
        <img src="${video.cover || '/assets/avatar.jpg'}" alt="Cover" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 14px; font-weight: 600; color: #fff; line-height: 1.4;">
          ${video.title}
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">
          TikTok ID: <span style="font-family: var(--font-mono); color: #38bdf8;">${video.tiktokId || video.id}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">
          File: <span style="font-family: var(--font-mono); color: #a1a1aa;">${video.fileName || 'video.mp4'}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #13121f; padding: 10px; border-radius: 6px; border: 1px solid #232038; margin-top: 6px;">
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 700; color: #fff;">${formatViews(video.views)}</div>
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Views</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 700; color: #fb7185;">${formatViews(video.likes || video.views * 0.12)}</div>
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Likes</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 700; color: #38bdf8;">${formatViews(video.shares || video.views * 0.02)}</div>
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Shares</div>
          </div>
        </div>

        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">
          Ngày đăng: <b>${video.postDate || 'Vừa xong'}</b> • Creator: <b>${video.creator || 'Kaycee'}</b>
        </div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Đóng</button>
  `;

  modal.classList.add('open');
}
