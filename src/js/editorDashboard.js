import { saveStudioData } from './data.js';

export function renderEditorDashboard(data, onShowToast = () => {}) {
  const container = document.getElementById('dashboardView') || document.getElementById('editorDeskView');
  if (!container) return;
  const contracts = data.contracts || [];
  const videos = data.videos || [];
  const queue = data.videoVault || [];
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const nextDeadline = contracts.find(c => c.status === 'active')?.brand || 'Belum ada deal aktif';

  container.innerHTML = `
    <section class="editor-dashboard">
      <div class="editor-hero">
        <div>
          <div class="eyebrow">DASHBOARD STUDIO / ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <h2>Kaycee Studio Workspace</h2>
          <p>Pusat kontrol ringkasan produksi konten, kontrak brand aktif, dan antrian video.</p>
        </div>
      </div>

      <div class="editor-stats">
        <div class="editor-stat"><span>Antrian Video</span><strong>${queue.length}</strong><small>Draft di Video Vault</small></div>
        <div class="editor-stat"><span>Kontrak Aktif</span><strong>${activeContracts}</strong><small>${nextDeadline}</small></div>
        <div class="editor-stat"><span>Video Terpublikasi</span><strong>${videos.length}</strong><small>Di katalog Posted</small></div>
        <div class="editor-stat"><span>Akun Terhubung</span><strong>${Object.keys(data.accounts || {}).length}</strong><small>Platform TikTok</small></div>
      </div>

      <div class="editor-grid">
        <div class="editing-queue panel-card">
          <div class="panel-heading"><div><span class="eyebrow">PRODUCTION BOARD</span><h3>Antrian Editing & Render</h3></div><span class="live-dot">● Status</span></div>
          <div class="queue-list">
            ${queue.length === 0 ? `
              <div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 36px 16px;">
                Belum ada antrian video. Masuk ke tab <b>Video</b> untuk menambahkan draft proyek.
              </div>
            ` : queue.map(item => `
              <button class="queue-item" data-edit-id="${item.id}">
                <span class="queue-play">▶</span><span class="queue-copy"><strong>${item.title}</strong><small>${item.targetAccount || 'Personal'} · ${item.resolution || '9:16'}</small></span>
                <span class="queue-meta"><b class="status-${(item.status || 'draft').toLowerCase().replace(/\s+/g, '-')}">${item.status}</b><small>${item.duration || '0:30'}</small></span>
              </button>`).join('')}
          </div>
        </div>

        <div class="panel-card focus-card">
          <div class="panel-heading"><div><span class="eyebrow">TODAY'S FOCUS</span><h3>Creator priorities</h3></div></div>
          <div class="focus-list">
            <div class="focus-row"><span class="focus-icon cyan">01</span><div><strong>Finish the Valorant montage</strong><small>Export 9:16 · Add captions · 30–45 sec</small></div></div>
            <div class="focus-row"><span class="focus-icon purple">02</span><div><strong>Send ASUS ROG review</strong><small>Check logo safe-area and CTA timing</small></div></div>
            <div class="focus-row"><span class="focus-icon amber">03</span><div><strong>Prepare weekend batch</strong><small>Pick 3 clips for TikTok scheduling</small></div></div>
          </div>
        </div>
      </div>

      <div class="editor-bottom-grid">
        <div class="panel-card"><div class="panel-heading"><div><span class="eyebrow">DELIVERY CHECKLIST</span><h3>Before you export</h3></div></div><div class="checklist"><label><input type="checkbox"> Captions and hook checked</label><label><input type="checkbox"> Music is cleared / credited</label><label><input type="checkbox"> 1080 × 1920, H.264, under 60 sec</label><label><input type="checkbox"> Thumbnail and first frame are strong</label></div></div>
        <div class="panel-card shortcut-card"><span class="eyebrow">QUICK ACTIONS</span><h3>Keep momentum</h3><div class="shortcut-grid"><button data-editor-action="client">Client update</button><button data-editor-action="script">Open script notes</button><button data-editor-action="export">Export checklist</button><button data-editor-action="content">Log finished video</button></div></div>
      </div>
    </section>`;

  container.querySelector('#editorAddTask')?.addEventListener('click', () => onShowToast('Quick task created — add the footage and deadline in your project notes.'));
  container.querySelectorAll('[data-edit-id]').forEach(btn => btn.addEventListener('click', () => onShowToast(`Opened ${btn.querySelector('strong')?.textContent || 'edit task'}.`)));
  container.querySelectorAll('[data-editor-action]').forEach(btn => btn.addEventListener('click', () => onShowToast(`${btn.textContent} is ready.`)));
}
