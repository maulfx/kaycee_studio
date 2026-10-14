/**
 * Kaycee Studio Pro - Master Application Controller
 */

import { getStudioData, saveStudioData, resetStudioData } from './data.js';
import { 
  renderTikTokView, 
  showConnectAccountModal, 
  showManageAccountsModal 
} from './tiktok.js';
import { renderContractsView } from './contracts.js';
import { renderAdsPromoView } from './adsPromo.js';
import { renderGameEventsView } from './gameEvents.js';
import { 
  renderAiAgentView, 
  askAiAboutVideoHelper, 
  askAiAboutContractHelper, 
  askAiAboutEventHelper 
} from './aiAgent.js';

let appState = null;
let currentTab = 'tiktok';

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
      <button class="account-chip active" id="btnConnectAccountTopbar" style="border-style: dashed; border-color: var(--accent-cyan); color: var(--accent-cyan);">
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
      <button class="account-chip ${isActive ? 'active' : ''}" data-account="${acc.id}" style="${isActive ? `border-color: ${acc.accentColor};` : ''}">
        <span class="account-indicator-dot" style="background: ${acc.accentColor};"></span>
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
    <button class="account-chip" id="btnConnectAccountTopbar" title="Hubungkan Akun Baru" style="padding: 6px 10px; background: rgba(0, 242, 254, 0.08); border-color: rgba(0, 242, 254, 0.3); color: var(--accent-cyan);">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
    </button>
    <button class="account-chip" id="btnManageAccountsTopbar" title="Kelola / Hapus Akun" style="padding: 6px 10px; opacity: 0.85;">
      ⚙️
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
 * Render view based on currentTab
 */
function renderCurrentView() {
  if (currentTab === 'tiktok') {
    renderTikTokView(
      appState,
      (videoTitle) => askAiAboutVideoHelper(videoTitle, appState, showToast, switchTab),
      showToast,
      () => {
        renderAccountSwitcher();
        renderCurrentView();
      }
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

  // Brand logo click goes to TikTok dashboard
  document.querySelector('.brand-badge')?.addEventListener('click', () => {
    switchTab('tiktok');
  });

  // Render dynamic account switcher in topbar
  renderAccountSwitcher();

  // Render initial tab
  switchTab('tiktok');
  console.log('🚀 Kaycee Studio Pro initialized successfully!');
}

document.addEventListener('DOMContentLoaded', initApp);
