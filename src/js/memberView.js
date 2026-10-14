/**
 * Kaycee Studio - Member & Team Module (VideoFlow Style)
 * Studio editors, animators, sound engineers, and collaborators
 */

import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';
import { saveStudioData } from './data.js';

let memberSearchQuery = '';

export function renderMemberView(data, onShowToast, onStateChanged) {
  const container = document.getElementById('memberView');
  if (!container) return;

  if (!data.teamMembers || data.teamMembers.length === 0) {
    data.teamMembers = [
      {
        id: 'mem-01',
        name: 'Kaycee',
        email: 'owner@kayceestudio.com',
        role: 'Studio Owner & Content Creator',
        avatar: '/assets/avatar.jpg',
        status: 'Online',
        projectsCount: (data.videos || []).length,
        isOwner: true
      }
    ];
  }

  let list = data.teamMembers;
  if (memberSearchQuery.trim()) {
    const q = memberSearchQuery.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <!-- Header matching VideoFlow -->
    <div class="vf-posted-header">
      <div class="vf-header-left">
        <h2 class="vf-title">Team Members</h2>
        <p class="vf-sub">Kelola tim editor, kreator konten, dan kolaborator studio</p>
      </div>

      <div class="vf-header-right">
        <div class="vf-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="memberSearchInput" class="vf-search-input" placeholder="Cari nama anggota tim..." value="${memberSearchQuery}" />
        </div>

        <button class="btn vf-btn-primary" id="btnInviteMember">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>+ Tambah Anggota</span>
        </button>
      </div>
    </div>

    <!-- Subtitle Bar -->
    <div class="vf-sub-bar">
      <span class="vf-dot-live"></span>
      <span>Hak akses proyek dan aset studio di PC lokal</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11.5px;">Total: <b>${list.length}</b> anggota</span>
    </div>

    <!-- Table Container -->
    <div class="vf-table-card">
      <table class="vf-table">
        <thead>
          <tr>
            <th style="width: 45%;">ANGGOTA TIM</th>
            <th style="width: 20%;">PERAN</th>
            <th style="width: 12%;">PROYEK</th>
            <th style="width: 13%;">STATUS</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(mem => `
            <tr class="vf-table-row">
              <td>
                <div class="vf-post-cell">
                  <div class="vf-thumb-box" style="border-radius: 50%;">
                    <img src="${mem.avatar}" alt="${mem.name}" class="vf-thumb-img" />
                  </div>
                  <div>
                    <div style="font-weight: 600; color: #fff; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
                      ${mem.name}
                      ${mem.isOwner ? '<span style="font-size: 10px; background: rgba(168, 85, 247, 0.2); color: #c084fc; padding: 1px 6px; border-radius: 4px; font-weight: 700;">OWNER</span>' : ''}
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono);">${mem.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="vf-creator-pill">${mem.role}</span>
              </td>
              <td>
                <span style="font-weight: 700; color: #fff;">${mem.projectsCount}</span>
                <span style="color: var(--text-muted); font-size: 11px;"> video</span>
              </td>
              <td>
                <span style="
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  font-size: 11.5px;
                  font-weight: 600;
                  ${mem.status === 'Online' ? 'color: #34d399;' : ''}
                  ${mem.status === 'Editing' ? 'color: #38bdf8;' : ''}
                  ${mem.status === 'Idle' ? 'color: #94a3b8;' : ''}
                ">
                  <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                  ${mem.status}
                </span>
              </td>
              <td>
                <div class="vf-actions-group">
                  <button class="btn-vf-action btn-vf-detail btn-contact-mem" data-id="${mem.id}" title="Hubungi Anggota">Hubungi</button>
                  ${!mem.isOwner ? `<button class="btn-vf-action btn-vf-delete btn-delete-mem" data-id="${mem.id}" title="Hapus Anggota">Hapus</button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Search
  container.querySelector('#memberSearchInput')?.addEventListener('input', (e) => {
    memberSearchQuery = e.target.value;
    renderMemberView(data, onShowToast, onStateChanged);
  });

  // Invite
  container.querySelector('#btnInviteMember')?.addEventListener('click', () => {
    playClickSound();
    const name = prompt('Nhập tên thành viên mới:');
    if (name && name.trim()) {
      const email = prompt('Nhập email thành viên:', `${name.trim().toLowerCase().replace(/\s+/g, '')}@studio.vn`);
      const role = prompt('Nhập vai trò (ví dụ: Video Editor, Animator):', 'Video Editor');
      data.teamMembers.push({
        id: `mem-${Date.now()}`,
        name: name.trim(),
        email: email || 'editor@studio.vn',
        role: role || 'Editor',
        avatar: '/assets/avatar.jpg',
        status: 'Online',
        projectsCount: 1,
        isOwner: false
      });
      saveStudioData(data);
      playSuccessSound();
      if (onShowToast) onShowToast(`Đã thêm thành viên ${name.trim()} vào studio!`);
      renderMemberView(data, onShowToast, onStateChanged);
      if (onStateChanged) onStateChanged();
    }
  });

  // Contact
  container.querySelectorAll('.btn-contact-mem').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const id = btn.dataset.id;
      const mem = data.teamMembers.find(m => m.id === id);
      if (onShowToast) onShowToast(`Mở hộp thoại với ${mem?.name}`);
    });
  });

  // Delete
  container.querySelectorAll('.btn-delete-mem').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Xóa thành viên này khỏi studio?')) {
        data.teamMembers = data.teamMembers.filter(m => m.id !== id);
        saveStudioData(data);
        if (onShowToast) onShowToast('Đã xóa thành viên.');
        renderMemberView(data, onShowToast, onStateChanged);
        if (onStateChanged) onStateChanged();
      }
    });
  });
}
