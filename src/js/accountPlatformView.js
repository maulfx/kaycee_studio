/**
 * Kaycee Studio - Account Platform Module
 * Manages connected multi-account platforms (TikTok, etc.)
 */

import { saveOrUpdateAccount, deleteConnectedAccount, saveStudioData } from './data.js';
import { buildQuickAccountData, showConnectAccountModal } from './tiktok.js';
import { playClickSound, playSuccessSound, playChimeSound } from './sound.js';
import confetti from 'canvas-confetti';

export function renderAccountPlatformView(data, onShowToast, onStateChanged) {
  const container = document.getElementById('accountPlatformView');
  if (!container) return;

  const accounts = data.accounts || {};
  const list = Object.values(accounts);

  container.innerHTML = `
    <!-- Header -->
    <div class="vf-posted-header">
      <div class="vf-header-left">
        <h2 class="vf-title">Account Platform</h2>
        <p class="vf-sub">Kelola akun TikTok & platform media sosial yang terhubung</p>
      </div>

      <div class="vf-header-right">
        <button class="btn vf-btn-primary" id="btnAddNewPlatformAcc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>+ Hubungkan Akun Baru</span>
        </button>
      </div>
    </div>

    <!-- Subtitle Bar -->
    <div class="vf-sub-bar">
      <span class="vf-dot-live"></span>
      <span>Mendukung pengelolaan multi-akun TikTok langsung di PC Anda (Penyimpanan Lokal)</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11.5px;">Terhubung: <b>${list.length}</b> akun</span>
    </div>

    <!-- Quick Add Bar -->
    <div style="background: #141320; border: 1px solid #232038; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 22px;">⚡</span>
        <div>
          <div style="font-size: 13.5px; font-weight: 600; color: #fff;">Hubungkan Cepat Akun TikTok</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">Masukkan username TikTok untuk menautkan akun ke dashboard studio</div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; flex: 1; max-width: 440px;">
        <input type="text" id="quickAddPlatformInput" class="vf-search-input" placeholder="@username_tiktok_anda" style="background: #0e0d16; border-color: #2c2748;" />
        <button class="btn vf-btn-primary" id="btnQuickAddPlatformSubmit" style="white-space: nowrap; padding: 0 16px;">
          Hubungkan
        </button>
      </div>
    </div>

    <!-- Accounts Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
      ${list.length === 0 ? `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: #141320; border: 1px solid #232038; border-radius: 8px;">
          <div style="font-size: 32px; margin-bottom: 8px;">📱</div>
          <h3 style="font-size: 16px; font-weight: 600; color: #fff;">Belum Ada Akun TikTok yang Terhubung</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin: 6px auto 14px; max-width: 420px;">
            Ketik username TikTok Anda pada kolom di atas, atau klik salah satu preset akun di bawah untuk mulai menghubungkan.
          </p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="btn btn-secondary btn-sm" id="btnQuickAddGaming">🎮 @kaycee.gaming</button>
            <button class="btn btn-secondary btn-sm" id="btnQuickAddLifestyle">📱 @kaycee.lifestyle</button>
          </div>
        </div>
      ` : list.map(acc => {
        const isActive = data.activeAccount === acc.id;
        return `
          <div class="glass-card" style="display: flex; flex-direction: column; gap: 14px; border-color: ${isActive ? '#7c3aed' : '#232038'}; background: ${isActive ? '#181628' : '#141320'};">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${acc.avatar || '/assets/avatar.jpg'}" alt="${acc.handle}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid ${acc.accentColor || '#7c3aed'};" />
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                    <span>${acc.displayName}</span>
                    ${isActive ? `<span style="font-size: 10px; background: #7c3aed; color: #fff; padding: 1px 6px; border-radius: 4px;">Sedang Aktif</span>` : ''}
                  </div>
                  <div style="font-size: 12px; color: #38bdf8; font-family: var(--font-mono);">${acc.handle}</div>
                </div>
              </div>
              <span class="status-badge" style="background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.3); color: #34d399; font-size: 10px;">
                ● Online
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: #0e0d16; padding: 8px; border-radius: 6px; border: 1px solid #1c1a2d; text-align: center;">
              <div>
                <div style="font-size: 14px; font-weight: 600; color: #fff;">${(acc.followers >= 1000 ? (acc.followers/1000).toFixed(1) + 'K' : acc.followers)}</div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Followers</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 600; color: #fb7185;">${(acc.totalLikes >= 1000000 ? (acc.totalLikes/1000000).toFixed(1) + 'M' : acc.totalLikes)}</div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Likes</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 600; color: #34d399;">${acc.engagementRate}%</div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Engagement</div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px solid #232038;">
              <button class="btn btn-secondary btn-sm btn-select-platform-acc" data-id="${acc.id}" style="flex: 1;">
                ${isActive ? '✓ Sedang Dipakai' : 'Pilih Akun Ini'}
              </button>
              <button class="btn-vf-action btn-vf-sync btn-sync-platform-acc" data-id="${acc.id}">Sync</button>
              <button class="btn-vf-action btn-vf-delete btn-del-platform-acc" data-id="${acc.id}">Hapus</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Quick Add submit
  const submitAdd = (handle) => {
    if (!handle || !handle.trim()) {
      alert('Silakan masukkan username TikTok.');
      return;
    }
    const newAcc = buildQuickAccountData(handle.trim());
    saveOrUpdateAccount(data, newAcc);
    playSuccessSound();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    if (onShowToast) onShowToast(`Akun ${newAcc.handle} berhasil dihubungkan!`);
    if (onStateChanged) onStateChanged();
    renderAccountPlatformView(data, onShowToast, onStateChanged);
  };

  document.getElementById('btnQuickAddPlatformSubmit')?.addEventListener('click', () => {
    const val = document.getElementById('quickAddPlatformInput')?.value;
    submitAdd(val);
  });

  document.getElementById('quickAddPlatformInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitAdd(e.target.value);
    }
  });

  document.getElementById('btnAddNewPlatformAcc')?.addEventListener('click', () => {
    showConnectAccountModal(data, null, () => {
      renderAccountPlatformView(data, onShowToast, onStateChanged);
      if (onStateChanged) onStateChanged();
    });
  });

  document.getElementById('btnQuickAddGaming')?.addEventListener('click', () => {
    submitAdd('@kaycee.gaming');
  });

  document.getElementById('btnQuickAddLifestyle')?.addEventListener('click', () => {
    submitAdd('@kaycee.lifestyle');
  });

  // Action buttons
  container.querySelectorAll('.btn-select-platform-acc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      data.activeAccount = id;
      saveStudioData(data);
      playClickSound();
      if (onShowToast) onShowToast(`Beralih ke akun: ${data.accounts[id]?.handle}`);
      if (onStateChanged) onStateChanged();
      renderAccountPlatformView(data, onShowToast, onStateChanged);
    });
  });

  container.querySelectorAll('.btn-sync-platform-acc').forEach(btn => {
    btn.addEventListener('click', () => {
      playChimeSound();
      if (onShowToast) onShowToast('Data akun TikTok berhasil disinkronkan!');
    });
  });

  container.querySelectorAll('.btn-del-platform-acc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const target = data.accounts[id];
      if (confirm(`Hapus akun ${target?.handle}?`)) {
        deleteConnectedAccount(data, id);
        if (onShowToast) onShowToast(`Akun ${target?.handle} telah dihapus.`);
        if (onStateChanged) onStateChanged();
        renderAccountPlatformView(data, onShowToast, onStateChanged);
      }
    });
  });
}
