import { saveStudioData } from './data.js';

const queue = [
  { id: 'reel-01', title: 'Valorant clutch montage', client: 'Personal', status: 'Editing', due: 'Today', tag: 'Short-form' },
  { id: 'reel-02', title: 'ASUS ROG sponsor cut', client: 'ASUS ROG', status: 'Review', due: 'Tomorrow', tag: 'Brand deal' },
  { id: 'reel-03', title: 'MLBB tournament highlights', client: 'Moonton', status: 'Queued', due: 'Fri, 18 Oct', tag: 'Gaming' }
];

export function renderEditorDashboard(data, onShowToast = () => {}) {
  const container = document.getElementById('dashboardView') || document.getElementById('editorDeskView');
  if (!container) return;
  const contracts = data.contracts || [];
  const videos = data.videos || [];
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const nextDeadline = contracts.find(c => c.status === 'active')?.brand || 'No brand deadline';

  container.innerHTML = `
    <section class="editor-dashboard">
      <div class="editor-hero">
        <div>
          <div class="eyebrow">EDITOR DESK / ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          <h2>Make today’s edit flow.</h2>
          <p>Your production cockpit for gaming edits, client revisions, and content delivery.</p>
        </div>
        <button class="btn btn-primary" id="editorAddTask">+ Add edit task</button>
      </div>

      <div class="editor-stats">
        <div class="editor-stat"><span>In queue</span><strong>${queue.length}</strong><small>Short-form projects</small></div>
        <div class="editor-stat"><span>Client revisions</span><strong>${queue.filter(x => x.status === 'Review').length}</strong><small>Needs your attention</small></div>
        <div class="editor-stat"><span>Active deals</span><strong>${activeContracts}</strong><small>${nextDeadline}</small></div>
        <div class="editor-stat"><span>Catalogued videos</span><strong>${videos.length}</strong><small>Across your channels</small></div>
      </div>

      <div class="editor-grid">
        <div class="editing-queue panel-card">
          <div class="panel-heading"><div><span class="eyebrow">PRODUCTION BOARD</span><h3>Editing Queue</h3></div><span class="live-dot">● Live</span></div>
          <div class="queue-list">${queue.map(item => `
            <button class="queue-item" data-edit-id="${item.id}">
              <span class="queue-play">▶</span><span class="queue-copy"><strong>${item.title}</strong><small>${item.client} · ${item.tag}</small></span>
              <span class="queue-meta"><b class="status-${item.status.toLowerCase()}">${item.status}</b><small>${item.due}</small></span>
            </button>`).join('')}</div>
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
