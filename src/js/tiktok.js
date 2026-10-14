/**
 * Kaycee Studio Pro - TikTok Multi-Account Dashboard Module
 * Fully dynamic account management with manual connection support
 */

import { 
  saveStudioData, 
  saveOrUpdateAccount, 
  deleteConnectedAccount, 
  clearAllAccounts, 
  resetStudioData 
} from './data.js';
import { renderViewsTrendChart, renderAudienceDistributionChart, initCharts } from './charts.js';
import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';

let currentFilter = 'all';
let searchQuery = '';

/**
 * Render TikTok Dashboard Section
 */
export function renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged) {
  const container = document.getElementById('tiktokView');
  if (!container) return;

  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);
  const activeAcc = data.activeAccount || (accountsList[0]?.id || 'all');
  const allVideos = data.videos || [];

  // If no accounts are connected, display an intuitive Empty State
  if (accountsList.length === 0) {
    container.innerHTML = `
      <div class="account-hero-card" style="text-align: center; padding: 56px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(0, 242, 254, 0.1); border: 2px dashed var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-size: 32px;">
          📱
        </div>
        <div>
          <h3 style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px;">Belum Ada Akun TikTok Terhubung</h3>
          <p style="color: var(--text-muted); font-size: 14px; max-width: 540px; margin: 0 auto; line-height: 1.6;">
            Hubungkan akun TikTok asli Anda secara manual. Anda dapat memasukkan username, metrik follower, likes, dan mulai mengelola video studio.
          </p>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-primary" id="btnConnectAccountEmptyBtn" style="padding: 11px 24px; font-size: 14px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            + Hubungkan Akun TikTok Asli
          </button>
          <button class="btn btn-secondary" id="btnRestoreDemoBtn" style="padding: 11px 20px; font-size: 14px;">
            Muat Data Contoh Demo
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnConnectAccountEmptyBtn')?.addEventListener('click', () => {
      playClickSound();
      showConnectAccountModal(data, null, () => {
        if (onStateChanged) onStateChanged();
        renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
      });
    });

    document.getElementById('btnRestoreDemoBtn')?.addEventListener('click', () => {
      playClickSound();
      const restored = resetStudioData();
      Object.assign(data, restored);
      if (onShowToast) onShowToast('Data demo berhasil dimuat ulang!');
      if (onStateChanged) onStateChanged();
      renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
    });

    return;
  }

  // Filter videos based on active account
  let filteredVideos = allVideos.filter(v => {
    if (activeAcc === 'all') return true;
    return v.accountId === activeAcc;
  });

  // Apply search query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filteredVideos = filteredVideos.filter(v =>
      v.title.toLowerCase().includes(q) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q))) ||
      (v.sponsorBrand && v.sponsorBrand.toLowerCase().includes(q))
    );
  }

  // Apply category pill filter
  if (currentFilter === 'viral') {
    filteredVideos = filteredVideos.filter(v => v.isViral || (v.views && v.views > 800000));
  } else if (currentFilter === 'sponsored') {
    filteredVideos = filteredVideos.filter(v => v.isSponsored);
  } else if (currentFilter === 'gaming') {
    filteredVideos = filteredVideos.filter(v => 
      (v.tags && v.tags.some(t => t.toLowerCase().includes('game') || t.toLowerCase().includes('mlbb') || t.toLowerCase().includes('val'))) ||
      accounts[v.accountId]?.category?.toLowerCase().includes('game')
    );
  } else if (currentFilter === 'vlog') {
    filteredVideos = filteredVideos.filter(v => 
      (v.tags && v.tags.some(t => t.toLowerCase().includes('setup') || t.toLowerCase().includes('vlog') || t.toLowerCase().includes('tour'))) ||
      accounts[v.accountId]?.category?.toLowerCase().includes('lifestyle')
    );
  }

  // Calculate stats based on active account or aggregated
  let totalFollowers = 0;
  let totalViews = 0;
  let totalLikes = 0;
  let avgEngagement = 0;
  let estRevenue = 0;
  let heroTitle = '';
  let heroHandle = '';
  let heroBio = '';
  let heroAvatar = '';
  let categoryTag = '';
  let avgWatchTime = '35s';
  let completionRate = '65%';

  if (activeAcc !== 'all' && accounts[activeAcc]) {
    const acc = accounts[activeAcc];
    totalFollowers = acc.followers || 0;
    totalViews = acc.totalViewsMonth || 0;
    totalLikes = acc.totalLikes || 0;
    avgEngagement = acc.engagementRate || 0;
    estRevenue = acc.estMonthlyRevenue || 0;
    heroTitle = acc.displayName || acc.handle;
    heroHandle = acc.handle;
    heroBio = acc.bio || 'TikTok Content Creator';
    heroAvatar = acc.avatar || '/assets/avatar.jpg';
    categoryTag = acc.category || 'Creator';
    avgWatchTime = acc.avgWatchTime || '35s';
    completionRate = acc.completionRate || '65%';
  } else {
    // Aggregated view
    totalFollowers = accountsList.reduce((sum, a) => sum + (a.followers || 0), 0);
    totalViews = accountsList.reduce((sum, a) => sum + (a.totalViewsMonth || 0), 0);
    totalLikes = accountsList.reduce((sum, a) => sum + (a.totalLikes || 0), 0);
    avgEngagement = accountsList.length 
      ? (accountsList.reduce((sum, a) => sum + (a.engagementRate || 0), 0) / accountsList.length).toFixed(1) 
      : 0;
    estRevenue = accountsList.reduce((sum, a) => sum + (a.estMonthlyRevenue || 0), 0);
    heroTitle = accountsList.length > 1 
      ? `Kaycee Studio (${accountsList.length} Akun Terhubung)` 
      : accountsList[0].displayName;
    heroHandle = accountsList.map(a => a.handle).join(' • ');
    heroBio = accountsList.length > 1 
      ? 'Pusat Analitik Seluruh Akun TikTok Studio Terhubung.' 
      : (accountsList[0].bio || 'TikTok Content Creator');
    heroAvatar = accountsList[0]?.avatar || '/assets/avatar.jpg';
    categoryTag = accountsList.length > 1 ? 'Multi-Account Hub' : (accountsList[0].category || 'Creator');
  }

  container.innerHTML = `
    <!-- Account Profile Banner -->
    <div class="account-hero-card">
      <div class="account-hero-left">
        <div class="hero-avatar-wrap">
          <img src="${heroAvatar}" alt="Avatar" class="hero-avatar" />
          <span class="hero-badge-verified">✓</span>
        </div>
        <div class="hero-details">
          <h3>
            ${heroTitle}
            <span class="status-badge status-active" style="font-size: 11px;">${categoryTag}</span>
          </h3>
          <div class="account-handle-tag">${heroHandle}</div>
          <p class="hero-bio">${heroBio}</p>
          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <span class="hero-stat-num">${(totalFollowers / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}K</span>
              <span class="hero-stat-lbl">Followers</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-num">${(totalLikes / 1000000).toFixed(1)}M</span>
              <span class="hero-stat-lbl">Likes Akumulasi</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-num">${filteredVideos.length} Video</span>
              <span class="hero-stat-lbl">Terkatalog</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-num" style="color: var(--accent-emerald);">+18.2%</span>
              <span class="hero-stat-lbl">MoM Growth</span>
            </div>
          </div>
        </div>
      </div>
      <div class="account-hero-right" style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; align-items: center;">
        <button class="btn btn-primary" id="btnConnectAccountHeroBtn" style="padding: 9px 15px; font-size: 13px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          + Hubungkan Akun
        </button>
        <button class="btn btn-outline-cyan" id="btnAddVideoBtn" style="padding: 9px 15px; font-size: 13px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          + Input Video
        </button>
        <button class="btn btn-secondary" id="btnManageAccountsHeroBtn" title="Kelola Akun" style="padding: 9px 14px; font-size: 13px;">
          ⚙️ Kelola Akun
        </button>
      </div>
    </div>

    <!-- 4 KPI Cards Grid -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Tayangan (30 Hari)</span>
          <div class="stat-icon-wrap stat-icon-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
        <div class="stat-value">${(totalViews / 1000000).toFixed(2)}M</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +24.6% <span class="trend-sub">vs bulan lalu</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Rata-rata Engagement Rate</span>
          <div class="stat-icon-wrap stat-icon-pink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
        </div>
        <div class="stat-value">${avgEngagement}%</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +1.8% <span class="trend-sub">Diatas rata-rata kreator</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Estimasi Revenue TikTok</span>
          <div class="stat-icon-wrap stat-icon-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
        </div>
        <div class="stat-value">Rp ${(estRevenue / 1000000).toFixed(1)}M</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +31.2% <span class="trend-sub">Live & Brand Deals</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Rata-rata Watch Retention</span>
          <div class="stat-icon-wrap stat-icon-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="stat-value">${avgWatchTime}</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          ${completionRate} <span class="trend-sub">Completion rate</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="chart-container-row">
      <div class="glass-card">
        <div class="chart-header">
          <div class="chart-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Tren Tayangan 14 Hari Terakhir
          </div>
          <div class="chart-toggle-group">
            <button class="chart-toggle-btn active">14 Hari</button>
            <button class="chart-toggle-btn">30 Hari</button>
          </div>
        </div>
        <div style="height: 250px; position: relative;">
          <canvas id="viewsTrendChart"></canvas>
        </div>
      </div>

      <div class="glass-card">
        <div class="chart-header">
          <div class="chart-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            Distribusi Audiens & Kategori
          </div>
        </div>
        <div style="height: 250px; position: relative;">
          <canvas id="audienceDistChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Videos Toolbar & Feed -->
    <div class="content-toolbar">
      <div class="search-input-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="videoSearchInput" class="search-input" placeholder="Cari judul, tag, atau sponsor..." value="${searchQuery}" />
      </div>

      <div class="filter-pills">
        <button class="filter-pill ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Semua Video (${filteredVideos.length})</button>
        <button class="filter-pill ${currentFilter === 'viral' ? 'active' : ''}" data-filter="viral">🔥 Viral (>800K)</button>
        <button class="filter-pill ${currentFilter === 'sponsored' ? 'active' : ''}" data-filter="sponsored">⭐ Sponsored</button>
        <button class="filter-pill ${currentFilter === 'gaming' ? 'active' : ''}" data-filter="gaming">🎮 Gaming</button>
        <button class="filter-pill ${currentFilter === 'vlog' ? 'active' : ''}" data-filter="vlog">✨ Vlog & Setup</button>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="video-grid" id="videoGridContainer">
      ${filteredVideos.length === 0 ? `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-muted);">
          Tidak ada video yang cocok dengan filter atau pencarian Anda.
        </div>
      ` : filteredVideos.map(video => renderVideoCard(video, accounts)).join('')}
    </div>
  `;

  // Attach event listeners
  attachTikTokListeners(data, onAskAiVideo, onShowToast, onStateChanged);

  // Initialize Charts
  setTimeout(() => {
    initCharts(data, activeAcc);
  }, 50);
}

/**
 * Render single video card HTML
 */
function renderVideoCard(video, accounts = {}) {
  const account = accounts[video.accountId] || {};
  const accountTag = account.handle || `@${video.accountId || 'creator'}`;
  const accentColor = account.accentColor || 'var(--accent-cyan)';

  return `
    <div class="video-card" data-video-id="${video.id}">
      <div class="video-thumb-wrap">
        <img src="${video.cover}" alt="${video.title}" class="video-thumb-img" />
        <span class="video-account-tag" style="color: ${accentColor};">
          ${accountTag}
        </span>
        ${video.isViral ? `<span class="video-viral-badge">🔥 Viral Score ${video.viralScore || 90}</span>` : ''}
        ${video.isSponsored ? `<span class="video-viral-badge" style="background: var(--grad-primary); right: auto; left: 10px; top: 40px;">⭐ Sponsored • ${video.sponsorBrand || 'Brand'}</span>` : ''}
        <span class="video-duration">${video.duration || '0:45'}</span>
      </div>

      <div class="video-body">
        <h4 class="video-title" title="${video.title}">${video.title}</h4>
        <div class="video-sound">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          ${video.sound || 'Original Sound'}
        </div>

        <div class="video-metrics-bar">
          <div class="video-metric-item">
            <span class="video-metric-val">${((video.views || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}K</span>
            <span class="video-metric-lbl">Views</span>
          </div>
          <div class="video-metric-item">
            <span class="video-metric-val">${((video.likes || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}K</span>
            <span class="video-metric-lbl">Likes</span>
          </div>
          <div class="video-metric-item">
            <span class="video-metric-val">${(video.comments || 0).toLocaleString()}</span>
            <span class="video-metric-lbl">Komen</span>
          </div>
          <div class="video-metric-item">
            <span class="video-metric-val">${((video.shares || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}K</span>
            <span class="video-metric-lbl">Shares</span>
          </div>
        </div>

        <div class="video-footer-actions">
          <span class="video-post-date">${video.postDate || 'Baru saja'}</span>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm btn-ask-ai" data-video-title="${encodeURIComponent(video.title)}">
              🤖 AI
            </button>
            <button class="btn btn-outline-cyan btn-sm btn-play-sim" data-video-id="${video.id}" title="Simulasi Player TikTok di HP">
              ▶️ Player
            </button>
            <button class="btn btn-secondary btn-sm btn-video-details" data-video-id="${video.id}">
              Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Event Listeners for TikTok View
 */
function attachTikTokListeners(data, onAskAiVideo, onShowToast, onStateChanged) {
  // Search input
  const searchInput = document.getElementById('videoSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
    });
  }

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFilter = e.target.dataset.filter;
      renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
    });
  });

  // "Tanya AI" on video card
  document.querySelectorAll('.btn-ask-ai').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = decodeURIComponent(btn.dataset.videoTitle);
      if (onAskAiVideo) onAskAiVideo(title);
    });
  });

  // Video details modal trigger
  document.querySelectorAll('.btn-video-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      const id = btn.dataset.videoId;
      const video = data.videos.find(v => v.id === id);
      if (video) showVideoDetailModal(video, data.accounts);
    });
  });

  // Simulated TikTok Player trigger
  document.querySelectorAll('.btn-play-sim').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      const id = btn.dataset.videoId;
      const video = data.videos.find(v => v.id === id);
      if (video) showPhoneSimulatorModal(video, data.accounts, onShowToast);
    });
  });

  // Add new video button
  const addBtn = document.getElementById('btnAddVideoBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      playClickSound();
      showAddVideoModal(data, onAskAiVideo, onShowToast, () => {
        renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
      });
    });
  }

  // Connect Account Hero Button
  const connectHeroBtn = document.getElementById('btnConnectAccountHeroBtn');
  if (connectHeroBtn) {
    connectHeroBtn.addEventListener('click', () => {
      playClickSound();
      showConnectAccountModal(data, null, () => {
        if (onStateChanged) onStateChanged();
        renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
      });
    });
  }

  // Manage Accounts Hero Button
  const manageHeroBtn = document.getElementById('btnManageAccountsHeroBtn');
  if (manageHeroBtn) {
    manageHeroBtn.addEventListener('click', () => {
      playClickSound();
      showManageAccountsModal(data, () => {
        if (onStateChanged) onStateChanged();
        renderTikTokView(data, onAskAiVideo, onShowToast, onStateChanged);
      });
    });
  }
}

/**
 * Show Simulated TikTok Phone Player Modal
 */
function showPhoneSimulatorModal(video, accounts = {}, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const account = accounts[video.accountId] || {};
  const authorHandle = account.handle || `@${video.accountId || 'creator'}`;

  modalTitle.textContent = 'Simulasi Tampilan TikTok Mobile Player';
  modalBody.innerHTML = `
    <div class="phone-mockup-wrapper">
      <div class="phone-device">
        <div class="phone-screen" style="background-image: url('${video.cover}');">
          <div class="phone-screen-overlay"></div>

          <!-- Top Navigation Header -->
          <div class="phone-top-status">
            <span style="opacity: 0.6;">Mengikuti</span>
            <span style="border-bottom: 2px solid #fff; padding-bottom: 2px;">Untuk Anda</span>
          </div>

          <!-- Right Floating Engagement Column -->
          <div class="phone-right-actions">
            <div class="phone-action-item">
              <div style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid #fff; overflow: hidden; margin-bottom: 4px;">
                <img src="${video.cover}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>

            <div class="phone-action-item" id="phoneLikeBtn">
              <div class="phone-action-icon" style="color: #ff0050;">
                ❤️
              </div>
              <span class="phone-action-count" id="phoneLikeCount">${((video.likes || 0) / 1000).toFixed(1)}K</span>
            </div>

            <div class="phone-action-item">
              <div class="phone-action-icon">
                💬
              </div>
              <span class="phone-action-count">${((video.comments || 0) / 1000).toFixed(1)}K</span>
            </div>

            <div class="phone-action-item">
              <div class="phone-action-icon">
                ↗️
              </div>
              <span class="phone-action-count">${((video.shares || 0) / 1000).toFixed(1)}K</span>
            </div>

            <div class="phone-action-item">
              <div class="phone-disc-spin"></div>
            </div>
          </div>

          <!-- Bottom Meta & Caption -->
          <div class="phone-bottom-info">
            <div class="phone-author-handle">
              ${authorHandle}
              <span style="background: #20d5ec; color: #000; font-size: 10px; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center;">✓</span>
            </div>
            <div class="phone-caption-text">${video.title}</div>
            <div class="phone-sound-pill">
              🎵 ${(video.sound || 'Original Sound').substring(0, 24)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup Player</button>
  `;

  // Interactive Like Button in Phone Mockup
  const likeBtn = document.getElementById('phoneLikeBtn');
  const countEl = document.getElementById('phoneLikeCount');
  let liked = false;
  if (likeBtn && countEl) {
    likeBtn.addEventListener('click', () => {
      liked = !liked;
      playClickSound();
      if (liked) {
        likeBtn.querySelector('.phone-action-icon').style.transform = 'scale(1.4)';
        setTimeout(() => { likeBtn.querySelector('.phone-action-icon').style.transform = 'scale(1)'; }, 200);
        countEl.textContent = (((video.likes || 0) + 1) / 1000).toFixed(1) + 'K';
        if (onShowToast) onShowToast('❤️ Menyukai simulasi video!');
      } else {
        countEl.textContent = ((video.likes || 0) / 1000).toFixed(1) + 'K';
      }
    });
  }

  modal.classList.add('open');
}

/**
 * Show Video Detail Modal
 */
function showVideoDetailModal(video, accounts = {}) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const account = accounts[video.accountId] || {};
  const authorHandle = account.handle || `@${video.accountId || 'creator'}`;

  modalTitle.textContent = 'Analitik Video TikTok';
  modalBody.innerHTML = `
    <div style="display: flex; gap: 16px; margin-bottom: 20px;">
      <img src="${video.cover}" style="width: 110px; height: 140px; border-radius: var(--radius-md); object-fit: cover;" />
      <div style="flex: 1;">
        <span class="status-badge status-active" style="margin-bottom: 6px;">${authorHandle}</span>
        <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">${video.title}</h4>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">Dipublikasikan: ${video.postDate || 'Baru saja'} • Durasi: ${video.duration || '0:45'}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${(video.tags || []).map(t => `<span class="code-pill" style="font-size: 11px;">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
      <div class="stat-card" style="padding: 12px;">
        <span class="stat-label">Total Tayangan</span>
        <span class="stat-value" style="font-size: 20px; color: var(--accent-cyan);">${(video.views || 0).toLocaleString()}</span>
      </div>
      <div class="stat-card" style="padding: 12px;">
        <span class="stat-label">Sukai (Likes)</span>
        <span class="stat-value" style="font-size: 20px; color: var(--accent-pink);">${(video.likes || 0).toLocaleString()}</span>
      </div>
      <div class="stat-card" style="padding: 12px;">
        <span class="stat-label">Rasio Bagikan</span>
        <span class="stat-value" style="font-size: 20px; color: #818cf8;">${(video.shares || 0).toLocaleString()}</span>
      </div>
    </div>

    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
      <h5 style="font-weight: 700; color: #fff; margin-bottom: 12px; font-size: 13px;">Distribusi Sumber Tayangan:</h5>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>Untuk Anda (FYP Algorithm)</span>
            <span style="color: var(--accent-cyan); font-weight: 700;">88.4%</span>
          </div>
          <div class="target-progress-bar"><div class="target-progress-fill" style="width: 88.4%; background: var(--accent-cyan);"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>Halaman Profil Akun</span>
            <span style="color: var(--accent-pink); font-weight: 700;">7.2%</span>
          </div>
          <div class="target-progress-bar"><div class="target-progress-fill" style="width: 7.2%; background: var(--accent-pink);"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>Pencarian / Search Query</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">4.4%</span>
          </div>
          <div class="target-progress-bar"><div class="target-progress-fill" style="width: 4.4%; background: var(--accent-emerald);"></div></div>
        </div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
  `;

  modal.classList.add('open');
}

/**
 * Show Modal to Add New Video
 */
export function showAddVideoModal(data, onAskAiVideo, onShowToast, onDone) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);

  if (accountsList.length === 0) {
    alert('Harap hubungkan akun TikTok terlebih dahulu sebelum menambahkan video.');
    showConnectAccountModal(data, null, onDone);
    return;
  }

  modalTitle.textContent = 'Input Video Baru ke Katalog';
  modalBody.innerHTML = `
    <form id="addVideoForm">
      <div class="form-group">
        <label class="form-label">Pilih Akun TikTok</label>
        <select class="form-control" id="newVideoAccount">
          ${accountsList.map(acc => `<option value="${acc.id}">${acc.handle} (${acc.displayName})</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Judul Video (Caption)</label>
        <input type="text" class="form-control" id="newVideoTitle" placeholder="Contoh: Highlight Turnamen & Tips Fanny..." required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Sound / Audio yang Dipakai</label>
          <input type="text" class="form-control" id="newVideoSound" placeholder="Original Sound" value="Original Sound - Kaycee Studio" />
        </div>
        <div class="form-group">
          <label class="form-label">Durasi Video</label>
          <input type="text" class="form-control" id="newVideoDuration" placeholder="0:45" value="0:45" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Jumlah Tayangan (Views)</label>
          <input type="number" class="form-control" id="newVideoViews" placeholder="100000" value="150000" />
        </div>
        <div class="form-group">
          <label class="form-label">Hashtags (Pisahkan Koma)</label>
          <input type="text" class="form-control" id="newVideoTags" placeholder="#Gaming, #KayceeStudio" value="#Gaming, #KayceeStudio" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Status Sponsor Brand</label>
        <div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;">
          <label style="font-size: 13px; color: #fff; cursor: pointer;">
            <input type="checkbox" id="newVideoSponsored" style="margin-right: 6px;" /> Video Berbayar / Endorsement Brand
          </label>
        </div>
      </div>
      <div class="form-group" id="sponsorBrandWrap" style="display: none;">
        <label class="form-label">Nama Brand Sponsor</label>
        <input type="text" class="form-control" id="newVideoSponsorBrand" placeholder="Contoh: ASUS ROG, UniPin" />
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSubmitNewVideo">Simpan Video</button>
  `;

  // Toggle sponsor brand input
  const chk = document.getElementById('newVideoSponsored');
  const brandWrap = document.getElementById('sponsorBrandWrap');
  if (chk && brandWrap) {
    chk.addEventListener('change', () => {
      brandWrap.style.display = chk.checked ? 'block' : 'none';
    });
  }

  // Handle submit
  const btnSubmit = document.getElementById('btnSubmitNewVideo');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const title = document.getElementById('newVideoTitle').value.trim();
      if (!title) {
        alert('Mohon isi judul video terlebih dahulu.');
        return;
      }

      const accountId = document.getElementById('newVideoAccount').value;
      const sound = document.getElementById('newVideoSound').value.trim();
      const duration = document.getElementById('newVideoDuration').value.trim();
      const views = parseInt(document.getElementById('newVideoViews').value) || 10000;
      const tagsRaw = document.getElementById('newVideoTags').value;
      const isSponsored = document.getElementById('newVideoSponsored').checked;
      const sponsorBrand = document.getElementById('newVideoSponsorBrand').value.trim();

      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

      const targetAcc = accounts[accountId] || accountsList[0];
      const newVideo = {
        id: 'vid-' + Date.now(),
        accountId,
        title,
        cover: targetAcc?.avatar || '/assets/avatar.jpg',
        sound: sound || 'Original Sound - Kaycee Studio',
        duration: duration || '0:45',
        postDate: 'Baru saja',
        status: 'Published',
        views,
        likes: Math.round(views * 0.12),
        comments: Math.round(views * 0.005),
        shares: Math.round(views * 0.015),
        viralScore: views > 500000 ? 94 : 85,
        tags: tags.length ? tags : ['#KayceeStudio'],
        isSponsored,
        sponsorBrand: isSponsored ? sponsorBrand : null,
        isViral: views > 800000
      };

      if (!data.videos) data.videos = [];
      data.videos.unshift(newVideo);
      saveStudioData(data);

      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Video "${title.substring(0, 30)}..." berhasil disimpan!`);
      if (onDone) onDone();
    });
  }

  modal.classList.add('open');
}

/**
 * Show Modal to Connect or Edit a TikTok Account Manually
 */
export function showConnectAccountModal(data, accountIdToEdit = null, onDone) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const existing = accountIdToEdit && data.accounts ? data.accounts[accountIdToEdit] : null;

  modalTitle.textContent = existing ? `Edit Data Akun: ${existing.handle}` : 'Hubungkan Akun TikTok Manual';
  modalBody.innerHTML = `
    <form id="connectAccountForm">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Username / Handle TikTok *</label>
          <input type="text" class="form-control" id="accHandle" placeholder="@username_asli" value="${existing ? existing.handle : '@'}" required />
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Awali dengan @ (contoh: @kayceeofficial)</div>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Tampilan (Display Name) *</label>
          <input type="text" class="form-control" id="accDisplayName" placeholder="Nama Profil TikTok" value="${existing ? existing.displayName : ''}" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Kategori Konten</label>
          <select class="form-control" id="accCategory">
            <option value="Gaming & Esports" ${existing?.category?.includes('Gaming') ? 'selected' : ''}>Gaming & Esports</option>
            <option value="Tech & Gadget" ${existing?.category?.includes('Tech') ? 'selected' : ''}>Tech & Gadget</option>
            <option value="Lifestyle & Vlog" ${existing?.category?.includes('Lifestyle') ? 'selected' : ''}>Lifestyle & Daily Vlog</option>
            <option value="Edukasi & Tutorial" ${existing?.category?.includes('Edukasi') ? 'selected' : ''}>Edukasi & Tutorial</option>
            <option value="Entertainment" ${existing?.category?.includes('Entertainment') ? 'selected' : ''}>Entertainment & Hiburan</option>
            <option value="Fashion & Beauty" ${existing?.category?.includes('Fashion') ? 'selected' : ''}>Fashion & Beauty</option>
            <option value="Creator Studio">Creator Studio</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Warna Label Aksen</label>
          <select class="form-control" id="accColor">
            <option value="#00f2fe" ${existing?.accentColor === '#00f2fe' ? 'selected' : ''}>Cyan Neon (#00f2fe)</option>
            <option value="#ff0050" ${existing?.accentColor === '#ff0050' ? 'selected' : ''}>TikTok Pink (#ff0050)</option>
            <option value="#a855f7" ${existing?.accentColor === '#a855f7' ? 'selected' : ''}>Purple Neon (#a855f7)</option>
            <option value="#10b981" ${existing?.accentColor === '#10b981' ? 'selected' : ''}>Emerald Green (#10b981)</option>
            <option value="#f59e0b" ${existing?.accentColor === '#f59e0b' ? 'selected' : ''}>Amber Gold (#f59e0b)</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Jumlah Followers</label>
          <input type="number" class="form-control" id="accFollowers" placeholder="10000" value="${existing ? existing.followers : 10000}" />
        </div>
        <div class="form-group">
          <label class="form-label">Total Likes Akumulasi</label>
          <input type="number" class="form-control" id="accTotalLikes" placeholder="50000" value="${existing ? existing.totalLikes : 50000}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Estimasi Tayangan (Views Bulanan)</label>
          <input type="number" class="form-control" id="accViewsMonth" placeholder="100000" value="${existing ? existing.totalViewsMonth : 100000}" />
        </div>
        <div class="form-group">
          <label class="form-label">Engagement Rate (%)</label>
          <input type="number" step="0.1" class="form-control" id="accEngagement" placeholder="6.5" value="${existing ? existing.engagementRate : 6.5}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Bio Profil TikTok</label>
        <textarea class="form-control" id="accBio" rows="2" placeholder="Tuliskan bio profil TikTok Anda...">${existing ? existing.bio : ''}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">URL Foto Profil / Avatar (Opsional)</label>
        <input type="text" class="form-control" id="accAvatar" placeholder="/assets/avatar.jpg atau link gambar" value="${existing ? existing.avatar : '/assets/avatar.jpg'}" />
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSaveAccountModal">
      ${existing ? 'Perbarui Akun' : 'Hubungkan Akun'}
    </button>
  `;

  document.getElementById('btnSaveAccountModal')?.addEventListener('click', () => {
    const handle = document.getElementById('accHandle').value.trim();
    const displayName = document.getElementById('accDisplayName').value.trim();

    if (!handle || handle === '@') {
      alert('Mohon masukkan handle TikTok yang valid (contoh: @kayceeofficial).');
      return;
    }

    const followers = parseInt(document.getElementById('accFollowers').value) || 0;
    const accountData = {
      id: existing ? existing.id : 'acc_' + Date.now().toString(36),
      handle,
      displayName: displayName || handle,
      category: document.getElementById('accCategory').value,
      accentColor: document.getElementById('accColor').value,
      followers,
      totalLikes: parseInt(document.getElementById('accTotalLikes').value) || 0,
      totalViewsMonth: parseInt(document.getElementById('accViewsMonth').value) || 0,
      engagementRate: parseFloat(document.getElementById('accEngagement').value) || 5.0,
      bio: document.getElementById('accBio').value.trim() || 'TikTok Content Creator',
      avatar: document.getElementById('accAvatar').value.trim() || '/assets/avatar.jpg',
      following: existing ? existing.following : 120,
      estMonthlyRevenue: Math.round(followers * 45),
      avgWatchTime: existing ? existing.avgWatchTime : '35s',
      completionRate: existing ? existing.completionRate : '60%',
      weeklyGrowth: '+5.0%'
    };

    saveOrUpdateAccount(data, accountData);
    playSuccessSound();
    modal.classList.remove('open');
    if (onDone) onDone(accountData);
  });

  modal.classList.add('open');
}

/**
 * Show Modal to Manage and Delete Accounts
 */
export function showManageAccountsModal(data, onDone) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  const accounts = data.accounts || {};
  const list = Object.values(accounts);

  modalTitle.textContent = 'Kelola Akun TikTok';
  modalBody.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
        Daftar akun TikTok yang terhubung dengan Kaycee Studio. Anda dapat mengedit metrik, menghapus akun dummy/hantu, atau menghubungkan akun baru.
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto;">
        ${list.length === 0 ? `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 8px;">
            Belum ada akun TikTok yang terhubung.
          </div>
        ` : list.map(acc => `
          <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${acc.avatar}" alt="${acc.handle}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid ${acc.accentColor};" />
              <div>
                <div style="font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <span>${acc.displayName}</span>
                  <span class="status-badge" style="border-color: ${acc.accentColor}; color: ${acc.accentColor}; font-size: 10px;">${acc.handle}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                  ${(acc.followers || 0).toLocaleString('id-ID')} followers • ${(acc.totalLikes || 0).toLocaleString('id-ID')} likes • ${acc.category}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" data-edit-acc="${acc.id}">Edit</button>
              <button class="btn btn-outline-danger btn-sm" data-delete-acc="${acc.id}" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">Hapus</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <button class="btn btn-primary" id="btnModalAddNewAcc">
          + Hubungkan Akun Baru
        </button>

        <button class="btn btn-outline-danger" id="btnClearDemoAccountsBtn" style="font-size: 12px; color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
          Hapus Semua Akun Dummy / Ghost
        </button>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
  `;

  // Edit account handlers
  modalBody.querySelectorAll('[data-edit-acc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accId = btn.dataset.editAcc;
      showConnectAccountModal(data, accId, () => {
        if (onDone) onDone();
        showManageAccountsModal(data, onDone);
      });
    });
  });

  // Delete account handlers
  modalBody.querySelectorAll('[data-delete-acc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accId = btn.dataset.deleteAcc;
      const target = data.accounts[accId];
      if (confirm(`Hapus akun ${target?.handle}? Data video terkait akun ini juga akan dibersihkan.`)) {
        deleteConnectedAccount(data, accId);
        if (onDone) onDone();
        showManageAccountsModal(data, onDone);
      }
    });
  });

  // Add new account
  document.getElementById('btnModalAddNewAcc')?.addEventListener('click', () => {
    showConnectAccountModal(data, null, () => {
      if (onDone) onDone();
      showManageAccountsModal(data, onDone);
    });
  });

  // Clear all demo accounts
  document.getElementById('btnClearDemoAccountsBtn')?.addEventListener('click', () => {
    if (confirm('Hapus semua akun demo dan data contoh agar studio bersih untuk akun asli Anda?')) {
      clearAllAccounts(data);
      if (onDone) onDone();
      modal.classList.remove('open');
    }
  });

  modal.classList.add('open');
}
