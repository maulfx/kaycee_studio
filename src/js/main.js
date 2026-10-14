/**
 * Kaycee Studio Pro - Master Application Controller
 */

import { 
  getStudioData, 
  saveStudioData, 
  resetStudioData,
  loadDemoData,
  clearEntireStudioData 
} from './data.js';
import { 
  renderTikTokView, 
  showConnectAccountModal, 
  showManageAccountsModal 
} from './tiktok.js';
import { renderContractsView } from './contracts.js';
import { renderAdsPromoView } from './adsPromo.js';
import { renderGameEventsView } from './gameEvents.js';
import { renderEditorDashboard } from './editorDashboard.js';
import { 
  renderAiAgentView, 
  askAiAboutVideoHelper, 
  askAiAboutContractHelper, 
  askAiAboutEventHelper 
} from './aiAgent.js';
import { renderPostedView } from './postedView.js';
import { renderAccountPlatformView } from './accountPlatformView.js';
import { renderVideoVaultView } from './videoVaultView.js';
import { renderSourceView } from './sourceView.js';
import { renderMemberView } from './memberView.js';

let appState = null;
let currentTab = 'posted';

/**
 * Toast Notification Dispatcher
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div style="font-size: 16px;">⚡</div>
    <div style="flex: 1;">${message}</div>
  `;

  container.appendChild(toast);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Switch Active View Tab
 */
export function switchTab(tabId) {
  currentTab = tabId;

  // Update sidebar active link
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.tab === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle view sections
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(`${tabId}View`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update topbar title & subtext matching VideoFlow
  const pageTitle = document.getElementById('topbarPageTitle');
  const pageSub = document.getElementById('topbarPageSub');
  const tabTitles = {
    posted: { title: 'Posted', sub: 'Thư viện bài đã đăng của bạn' },
    dashboard: { title: 'Dashboard', sub: 'Tổng quan hiệu suất & tiến độ studio' },
    contracts: { title: 'Contract', sub: 'Quản lý hợp đồng tài trợ & Brand Deals' },
    adsPromo: { title: 'Ads/Promo', sub: 'Chiến dịch quảng cáo & mã khuyến mãi' },
    gameEvents: { title: 'Event', sub: 'Lịch sự kiện & giải đấu gaming' },
    videoVault: { title: 'Video', sub: 'Kho video & tiến độ sản xuất nội dung' },
    source: { title: 'Source', sub: 'Kho tài nguyên footage thô, VFX & âm thanh' },
    accountPlatform: { title: 'Account Platform', sub: 'Quản lý các tài khoản TikTok kết nối' },
    member: { title: 'Member', sub: 'Đội ngũ sáng tạo & biên tập viên' },
    aiAgent: { title: 'Hermes AI Agent', sub: 'Trợ lý AI phân tích kịch bản & tối ưu hóa' }
  };

  if (tabTitles[tabId]) {
    if (pageTitle) pageTitle.textContent = tabTitles[tabId].title;
    if (pageSub) pageSub.textContent = tabTitles[tabId].sub;
  }

  // Re-render target view
  renderCurrentView();
}

/**
 * Render Topbar Account Switcher Dynamically
 */
export function renderAccountSwitcher() {
  const container = document.getElementById('accountSwitcherGroup');
  if (!container) return;

  const accounts = appState.accounts || {};
  const list = Object.values(accounts);
  const active = appState.activeAccount;

  if (list.length === 0) {
    container.innerHTML = `
      <button class="account-chip" id="btnConnectAccountTopbar" style="border-color: #272a34; color: #a1a1aa;">
        <span>+ Hubungkan Akun TikTok</span>
      </button>
    `;
    document.getElementById('btnConnectAccountTopbar')?.addEventListener('click', () => {
      showConnectAccountModal(appState, null, () => {
        renderAccountSwitcher();
        renderCurrentView();
      });
    });
    return;
  }

  let html = '';

  list.forEach(acc => {
    const isActive = active === acc.id;
    const followersK = (acc.followers >= 1000) 
      ? (acc.followers / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'K' 
      : acc.followers;

    html += `
      <button class="account-chip ${isActive ? 'active' : ''}" data-account="${acc.id}">
        <span class="account-indicator-dot" style="background: ${acc.accentColor || '#38bdf8'};"></span>
        <span>${acc.handle}</span>
        <span class="chip-followers">${followersK}</span>
      </button>
    `;
  });

  if (list.length > 1) {
    const totalFollowers = list.reduce((sum, a) => sum + (a.followers || 0), 0);
    const totalFollowersM = (totalFollowers / 1000000).toFixed(2) + 'M';
    const isAllActive = active === 'all';
    html += `
      <button class="account-chip ${isAllActive ? 'active' : ''}" data-account="all">
        <span class="account-indicator-dot dot-purple"></span>
        <span>Semua Akun (Hub)</span>
        <span class="chip-followers">${totalFollowersM}</span>
      </button>
    `;
  }

  html += `
    <button class="account-chip" id="btnConnectAccountTopbar" title="Hubungkan Akun Baru" style="padding: 4px 8px; color: #a1a1aa;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
    </button>
    <button class="account-chip" id="btnManageAccountsTopbar" title="Kelola Akun" style="padding: 4px 8px; color: #a1a1aa;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
  `;

  container.innerHTML = html;

  // Add click listeners to account chips
  container.querySelectorAll('[data-account]').forEach(chip => {
    chip.addEventListener('click', () => {
      const accId = chip.dataset.account;
      if (accId) switchActiveAccount(accId);
    });
  });

  // Connect new account button
  document.getElementById('btnConnectAccountTopbar')?.addEventListener('click', () => {
    showConnectAccountModal(appState, null, () => {
      renderAccountSwitcher();
      renderCurrentView();
    });
  });

  // Manage accounts button
  document.getElementById('btnManageAccountsTopbar')?.addEventListener('click', () => {
    showManageAccountsModal(appState, () => {
      renderAccountSwitcher();
      renderCurrentView();
    });
  });
}

/**
 * Switch Active TikTok Account
 */
export function switchActiveAccount(accId) {
  appState.activeAccount = accId;
  saveStudioData(appState);

  renderAccountSwitcher();

  const accounts = appState.accounts || {};
  let accountName = 'Semua Akun (Hub)';
  if (accId !== 'all' && accounts[accId]) {
    accountName = accounts[accId].handle;
  }
  showToast(`Beralih ke: ${accountName}`);

  // Re-render current view to reflect account data
  renderCurrentView();
}

/**
 * Update Sidebar Nav Badges and Revenue Progress Dynamically
 */
export function updateSidebarMetrics() {
  if (!appState) return;

  const accountsCount = Object.keys(appState.accounts || {}).length;
  const activeContractsCount = (appState.contracts || []).filter(c => c.status === 'active').length;
  const promoCodesCount = (appState.adsPromo?.codes || []).length;
  const eventsCount = (appState.gameEvents || []).length;

  const tBadge = document.getElementById('navTikTokBadge');
  if (tBadge) tBadge.textContent = `${accountsCount} Akun`;

  const cBadge = document.getElementById('navContractsBadge');
  if (cBadge) cBadge.textContent = `${activeContractsCount} Aktif`;

  const aBadge = document.getElementById('navAdsPromoBadge');
  if (aBadge) aBadge.textContent = `${promoCodesCount} Kode`;

  const eBadge = document.getElementById('navGameEventsBadge');
  if (eBadge) eBadge.textContent = `${eventsCount} Event`;

  // Revenue Footer
  const totalRevenue = (appState.contracts || []).reduce((sum, c) => sum + (c.status !== 'draft' ? (c.value || 0) : 0), 0);
  const goal = appState.revenueGoal || (totalRevenue > 0 ? totalRevenue * 1.5 : 0);

  const curAmt = document.getElementById('targetCurrentAmount');
  const pctEl = document.getElementById('targetPercentage');
  const barEl = document.getElementById('targetProgressBar');
  const goalEl = document.getElementById('targetGoalLabel');
  const remEl = document.getElementById('targetRemainingLabel');

  if (curAmt) curAmt.textContent = totalRevenue > 0 ? `Rp ${totalRevenue.toLocaleString('id-ID')}` : 'Rp 0';
  if (pctEl) pctEl.textContent = goal > 0 ? `${Math.round((totalRevenue / goal) * 100)}%` : '0%';
  if (barEl) barEl.style.width = goal > 0 ? `${Math.min(100, Math.round((totalRevenue / goal) * 100))}%` : '0%';
  if (goalEl) goalEl.textContent = goal > 0 ? `Goal: Rp ${(goal / 1000000).toLocaleString('id-ID')} Juta` : 'Goal: Rp 0';
  if (remEl) {
    if (totalRevenue === 0) {
      remEl.textContent = 'Belum ada kontrak aktif';
    } else {
      const remaining = Math.max(0, goal - totalRevenue);
      remEl.textContent = `Sisa Rp ${(remaining / 1000000).toLocaleString('id-ID')} Juta`;
    }
  }
}

/**
 * Render view based on currentTab
 */
function renderCurrentView() {
  updateSidebarMetrics();

  if (currentTab === 'posted') {
    renderPostedView(
      appState,
      showToast,
      () => {
        renderAccountSwitcher();
        updateSidebarMetrics();
      }
    );
  } else if (currentTab === 'accountPlatform') {
    renderAccountPlatformView(
      appState,
      showToast,
      () => {
        renderAccountSwitcher();
        updateSidebarMetrics();
      }
    );
  } else if (currentTab === 'dashboard' || currentTab === 'editorDesk') {
    renderEditorDashboard(appState, showToast);
  } else if (currentTab === 'videoVault') {
    renderVideoVaultView(
      appState,
      showToast,
      () => updateSidebarMetrics()
    );
  } else if (currentTab === 'source') {
    renderSourceView(
      appState,
      showToast,
      () => updateSidebarMetrics()
    );
  } else if (currentTab === 'member') {
    renderMemberView(
      appState,
      showToast,
      () => updateSidebarMetrics()
    );
  } else if (currentTab === 'contracts') {
    renderContractsView(
      appState,
      (contract) => askAiAboutContractHelper(contract, appState, showToast, switchTab),
      showToast
    );
  } else if (currentTab === 'adsPromo') {
    renderAdsPromoView(
      appState,
      (promo) => {},
      showToast
    );
  } else if (currentTab === 'gameEvents') {
    renderGameEventsView(
      appState,
      (event) => askAiAboutEventHelper(event, appState, showToast, switchTab),
      showToast
    );
  } else if (currentTab === 'aiAgent') {
    renderAiAgentView(appState, showToast);
  } else if (currentTab === 'tiktok') {
    renderTikTokView(
      appState,
      (videoTitle) => askAiAboutVideoHelper(videoTitle, appState, showToast, switchTab),
      showToast,
      () => {
        renderAccountSwitcher();
        renderCurrentView();
      }
    );
  }
}

/**
 * Initialize Global Modal Listeners
 */
function initModalListeners() {
  const modal = document.getElementById('globalModal');
  const closeBtn = document.getElementById('globalModalClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

/**
 * Initialize Quick Create Menu
 */
function initQuickCreate() {
  const btn = document.getElementById('btnQuickCreate');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const modal = document.getElementById('globalModal');
    const modalTitle = document.getElementById('globalModalTitle');
    const modalBody = document.getElementById('globalModalBody');
    const modalFooter = document.getElementById('globalModalFooter');

    modalTitle.textContent = 'Aksi Cepat Studio (+ Buat Baru)';
    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <button class="glass-card quick-action-choice" id="qaNewVideo" style="text-align: left; cursor: pointer;">
          <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">Input Video TikTok</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Catat video baru ke katalog studio</div>
        </button>

        <button class="glass-card quick-action-choice" id="qaNewContract" style="text-align: left; cursor: pointer;">
          <div style="font-size: 24px; margin-bottom: 8px;">📑</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">Buat Kontrak Brand</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Deal sponsor, termin DP, & deliverables</div>
        </button>

        <button class="glass-card quick-action-choice" id="qaNewPromo" style="text-align: left; cursor: pointer;">
          <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">Proyek Ads / Kode</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Pipeline kampanye atau kode voucher</div>
        </button>

        <button class="glass-card quick-action-choice" id="qaNewEvent" style="text-align: left; cursor: pointer;">
          <div style="font-size: 24px; margin-bottom: 8px;">🎮</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">Jadwal Event Game</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Turnamen, watch party, & stream prep</div>
        </button>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    `;

    document.getElementById('qaNewVideo')?.addEventListener('click', () => {
      modal.classList.remove('open');
      switchTab('tiktok');
      setTimeout(() => document.getElementById('btnAddVideoBtn')?.click(), 100);
    });

    document.getElementById('qaNewContract')?.addEventListener('click', () => {
      modal.classList.remove('open');
      switchTab('contracts');
      setTimeout(() => document.getElementById('btnCreateContract')?.click(), 100);
    });

    document.getElementById('qaNewPromo')?.addEventListener('click', () => {
      modal.classList.remove('open');
      switchTab('adsPromo');
      setTimeout(() => document.getElementById('btnCreateCampaign')?.click(), 100);
    });

    document.getElementById('qaNewEvent')?.addEventListener('click', () => {
      modal.classList.remove('open');
      switchTab('gameEvents');
      setTimeout(() => document.getElementById('btnCreateGameEvent')?.click(), 100);
    });

    modal.classList.add('open');
  });
}

/**
 * Bootstrap Application
 */
function initApp() {
  appState = getStudioData();

  // Navigation Links
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.dataset.tab;
      if (tabId) switchTab(tabId);
    });
  });

  // Topbar AI quick button
  document.getElementById('btnAiQuick')?.addEventListener('click', () => {
    switchTab('aiAgent');
  });

  // Modals & Quick Create
  initModalListeners();
  initQuickCreate();

  // Brand logo click goes to Posted dashboard
  document.querySelector('.brand-badge')?.addEventListener('click', () => {
    switchTab('posted');
  });

  // Profile button opens Studio Settings & Data Manager
  document.querySelector('.user-profile-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('globalModal');
    const modalTitle = document.getElementById('globalModalTitle');
    const modalBody = document.getElementById('globalModalBody');
    const modalFooter = document.getElementById('globalModalFooter');

    const accountsCount = Object.keys(appState.accounts || {}).length;
    const contractsCount = (appState.contracts || []).length;

    modalTitle.textContent = 'Pengaturan Studio & Manajemen Data';
    modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="glass-card" style="padding: 14px 16px;">
          <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">Status Data Studio Saat Ini:</div>
          <div style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
            • <b>${accountsCount}</b> Akun TikTok terhubung<br/>
            • <b>${contractsCount}</b> Kontrak brand terdaftar<br/>
            • <b>${(appState.videos || []).length}</b> Video terkatalog<br/>
            • <b>${(appState.gameEvents || []).length}</b> Event game
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button class="btn btn-outline-danger" id="btnClearAllStudioData" style="justify-content: flex-start; padding: 12px 16px; text-align: left; border-color: rgba(239, 68, 68, 0.4); color: #ef4444;">
            <div>
              <div style="font-weight: 700;">🗑️ Kosongkan Semua Data (Clean Slate 100%)</div>
              <div style="font-size: 11.5px; opacity: 0.8; margin-top: 2px;">Hapus seluruh data dummy/contoh agar bersih untuk akun asli Anda.</div>
            </div>
          </button>

          <button class="btn btn-secondary" id="btnLoadDemoStudioData" style="justify-content: flex-start; padding: 12px 16px; text-align: left;">
            <div>
              <div style="font-weight: 700;">📂 Muat Data Contoh (Demo)</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Muat contoh akun gaming & lifestyle, kontrak ASUS ROG, dan turnamen untuk pengujian.</div>
            </div>
          </button>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
    `;

    document.getElementById('btnClearAllStudioData')?.addEventListener('click', () => {
      if (confirm('Kosongkan semua data studio agar 100% bersih?')) {
        clearEntireStudioData(appState);
        modal.classList.remove('open');
        showToast('Semua data studio berhasil dibersihkan!');
        renderAccountSwitcher();
        renderCurrentView();
      }
    });

    document.getElementById('btnLoadDemoStudioData')?.addEventListener('click', () => {
      loadDemoData(appState);
      modal.classList.remove('open');
      showToast('Data contoh demo berhasil dimuat!');
      renderAccountSwitcher();
      renderCurrentView();
    });

    modal.classList.add('open');
  });

  // Topbar global search sync
  const topbarSearch = document.getElementById('topbarGlobalSearch');
  if (topbarSearch) {
    topbarSearch.addEventListener('input', (e) => {
      const val = e.target.value;
      const postedSearch = document.getElementById('postedSearchInput');
      if (postedSearch) {
        postedSearch.value = val;
        postedSearch.dispatchEvent(new Event('input'));
      }
    });
  }

  // Render dynamic account switcher in topbar
  renderAccountSwitcher();

  // Render initial workspace: Posted view matching VideoFlow reference
  switchTab('posted');
  console.log('🚀 Kaycee Studio VideoFlow initialized successfully!');
}

document.addEventListener('DOMContentLoaded', initApp);
