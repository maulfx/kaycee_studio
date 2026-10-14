/**
 * Kaycee Studio Pro - Game Events & Tournaments Module
 */

import { saveStudioData } from './data.js';

let countdownInterval = null;

/**
 * Render Game Events View
 */
export function renderGameEventsView(data, onAskAiEvent, onShowToast) {
  const container = document.getElementById('gameEventsView');
  if (!container) return;

  const events = data.gameEvents || [];
  const totalFees = events.reduce((sum, e) => sum + (e.creatorFee || 0), 0);

  // Find nearest upcoming event
  const nextEvent = events.length > 0 ? events[0] : null;

  container.innerHTML = `
    <!-- Header -->
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
          Jadwal & Manajemen Event Game / Turnamen
        </h2>
        <p>Atur jadwal watch party official, showmatch turnamen creator, launch stream publisher, dan checklist persiapan OBS studio.</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-primary" id="btnCreateGameEvent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Event Game
        </button>
      </div>
    </div>

    <!-- Featured Banner with Live Countdown -->
    ${nextEvent ? `
      <div class="event-banner-card" style="background-image: url('${nextEvent.bannerImage}');">
        <div class="event-banner-overlay"></div>
        <div class="event-banner-content">
          <div class="event-banner-info">
            <span class="event-game-tag">🎮 ${nextEvent.game}</span>
            <h3>${nextEvent.title}</h3>
            <p style="color: #cbd5e1; font-size: 14px; margin-top: 6px;">
              Penyelenggara: <b>${nextEvent.organizer}</b> • Platform: <b>${nextEvent.platform}</b> • Fee: <b style="color: var(--accent-cyan);">Rp ${nextEvent.creatorFee.toLocaleString('id-ID')}</b>
            </p>
          </div>
          <div class="countdown-box">
            <div class="countdown-digit-wrap">
              <span class="countdown-num" id="cdDays">03</span>
              <span class="countdown-lbl">Hari</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-digit-wrap">
              <span class="countdown-num" id="cdHours">19</span>
              <span class="countdown-lbl">Jam</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-digit-wrap">
              <span class="countdown-num" id="cdMins">59</span>
              <span class="countdown-lbl">Menit</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-digit-wrap">
              <span class="countdown-num" id="cdSecs">30</span>
              <span class="countdown-lbl">Detik</span>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Event Quick Stats -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Fee Event Terjadwal</span>
          <div class="stat-icon-wrap stat-icon-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
        </div>
        <div class="stat-value">Rp ${(totalFees / 1000000).toLocaleString('id-ID')} Juta</div>
        <div class="stat-trend trend-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          4 Event Publisher Terverifikasi
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Event Mendatang</span>
          <div class="stat-icon-wrap stat-icon-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
        </div>
        <div class="stat-value">${events.length} Event</div>
        <div class="stat-trend" style="color: var(--accent-cyan);">
          Oktober - November 2026
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Platform Utama Stream</span>
          <div class="stat-icon-wrap stat-icon-pink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="14" height="14" x="1" y="5" rx="2" ry="2"/></svg>
          </div>
        </div>
        <div class="stat-value">TikTok Live</div>
        <div class="stat-trend" style="color: var(--accent-pink);">
          Broadcast ke ${Object.values(data.accounts || {})[0]?.handle || 'TikTok Live'}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Studio Equipment Ready</span>
          <div class="stat-icon-wrap stat-icon-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </div>
        </div>
        <div class="stat-value">100% Siap</div>
        <div class="stat-trend trend-up">
          Dual PC Stream + Elgato Cam Link
        </div>
      </div>
    </div>

    <!-- Events List Grid -->
    <div class="events-grid">
      ${events.map(event => renderEventCard(event)).join('')}
    </div>
  `;

  startCountdown(nextEvent ? nextEvent.date : '2026-10-18T15:00:00');
  attachGameEventListeners(data, onAskAiEvent, onShowToast);
}

/**
 * Render single event card
 */
function renderEventCard(event) {
  const prepDone = event.prepChecklist.filter(p => p.done).length;
  const prepTotal = event.prepChecklist.length;

  return `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-card-header">
        <span class="code-pill" style="font-size: 11px;">${event.game}</span>
        <span class="status-badge status-active">Rp ${(event.creatorFee / 1000000).toLocaleString('id-ID')}M Fee</span>
      </div>

      <h4 class="event-title">${event.title}</h4>
      <div class="event-date-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${event.displayDate}
      </div>

      <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
        <div><b>Penyelenggara:</b> ${event.organizer}</div>
        <div><b>Platform:</b> ${event.platform}</div>
      </div>

      <!-- Checklist Persiapan Streamer -->
      <div class="prep-checklist">
        <div style="font-size: 11.5px; font-weight: 700; color: #fff; margin-bottom: 4px; display: flex; justify-content: space-between;">
          <span>Checklist Persiapan Studio:</span>
          <span style="color: var(--accent-cyan);">${prepDone}/${prepTotal}</span>
        </div>
        ${event.prepChecklist.map((item, idx) => `
          <label class="prep-item" style="cursor: pointer;">
            <input type="checkbox" class="event-prep-chk" data-event-id="${event.id}" data-prep-idx="${idx}" ${item.done ? 'checked' : ''} />
            <span style="${item.done ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${item.task}</span>
          </label>
        `).join('')}
      </div>

      <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
        <button class="btn btn-secondary btn-sm btn-ask-ai-event" data-event-id="${event.id}" style="flex: 1;">
          🤖 Tanya AI Brief
        </button>
        <button class="btn btn-outline-cyan btn-sm btn-event-brief" data-event-id="${event.id}">
          Lihat Syarat
        </button>
      </div>
    </div>
  `;
}

/**
 * Start Countdown Timer
 */
function startCountdown(targetIsoDate) {
  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const target = new Date(targetIsoDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

/**
 * Attach Event Listeners
 */
function attachGameEventListeners(data, onAskAiEvent, onShowToast) {
  // Prep checklist toggle
  document.querySelectorAll('.event-prep-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const eventId = chk.dataset.eventId;
      const idx = parseInt(chk.dataset.prepIdx);

      const ev = data.gameEvents.find(e => e.id === eventId);
      if (ev && ev.prepChecklist[idx]) {
        ev.prepChecklist[idx].done = chk.checked;
        saveStudioData(data);
        if (onShowToast) onShowToast(`Persiapan event diperbarui.`);
        renderGameEventsView(data, onAskAiEvent, onShowToast);
      }
    });
  });

  // Ask AI about this event
  document.querySelectorAll('.btn-ask-ai-event').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.eventId;
      const ev = data.gameEvents.find(e => e.id === id);
      if (ev && onAskAiEvent) {
        onAskAiEvent(ev);
      }
    });
  });

  // View brief modal
  document.querySelectorAll('.btn-event-brief').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.eventId;
      const ev = data.gameEvents.find(e => e.id === id);
      if (ev) showEventBriefModal(ev);
    });
  });

  // Create game event
  const btnCreate = document.getElementById('btnCreateGameEvent');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      showCreateEventModal(data, onAskAiEvent, onShowToast);
    });
  }
}

/**
 * Show Event Brief Modal
 */
function showEventBriefModal(event) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = `Brief Event: ${event.title}`;
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="code-pill" style="margin-bottom: 8px;">${event.game}</span>
      <h4 style="font-size: 17px; font-weight: 800; color: #fff; margin-top: 6px;">${event.title}</h4>
      <div style="font-size: 13px; color: var(--accent-cyan); margin-top: 4px;">${event.displayDate}</div>
    </div>

    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 18px;">
      <h5 style="color: #fff; font-weight: 700; font-size: 13px; margin-bottom: 10px;">Kewajiban & Syarat Streaming Publisher:</h5>
      <ul style="padding-left: 18px; color: #cbd5e1; font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
        ${event.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <div class="stat-card" style="padding: 14px;">
      <span class="stat-label">Honorarium Creator Fee</span>
      <span class="stat-value" style="font-size: 22px; color: var(--accent-emerald);">Rp ${event.creatorFee.toLocaleString('id-ID')}</span>
      <span style="font-size: 11.5px; color: var(--text-muted);">Dibayarkan paling lambat 7 hari kerja setelah penyerahan laporan tayang.</span>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Tutup</button>
  `;

  modal.classList.add('open');
}

/**
 * Show Create Event Modal
 */
function showCreateEventModal(data, onAskAiEvent, onShowToast) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const modalFooter = document.getElementById('globalModalFooter');

  modalTitle.textContent = 'Tambah Jadwal Event Game / Turnamen';
  modalBody.innerHTML = `
    <form id="createEventForm">
      <div class="form-group">
        <label class="form-label">Nama Game</label>
        <input type="text" class="form-control" id="newEvGame" placeholder="Contoh: Mobile Legends, Valorant, Free Fire" required />
      </div>

      <div class="form-group">
        <label class="form-label">Judul Event / Turnamen</label>
        <input type="text" class="form-control" id="newEvTitle" placeholder="Contoh: Creator Battle Royale Invitational" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Penyelenggara</label>
          <input type="text" class="form-control" id="newEvOrg" placeholder="Contoh: Moonton, Riot, Garena" value="Publisher" />
        </div>
        <div class="form-group">
          <label class="form-label">Fee Creator (Rp)</label>
          <input type="number" class="form-control" id="newEvFee" value="10000000" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tanggal & Jam (Teks)</label>
          <input type="text" class="form-control" id="newEvDisplayDate" value="30 Okt 2026, 19:00 WIB" />
        </div>
        <div class="form-group">
          <label class="form-label">Platform Stream</label>
          <input type="text" class="form-control" id="newEvPlatform" value="TikTok Live" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Syarat Utama Konten (Pisahkan enter)</label>
        <textarea class="form-control" id="newEvReqs" rows="3">Live stream minimal 2 jam
Gunakan overlay resmi sponsor
Unggah highlight clip 1x ke TikTok</textarea>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('globalModal').classList.remove('open')">Batal</button>
    <button class="btn btn-primary" id="btnSubmitNewEvent">Simpan Event</button>
  `;

  const btnSubmit = document.getElementById('btnSubmitNewEvent');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const game = document.getElementById('newEvGame').value.trim();
      const title = document.getElementById('newEvTitle').value.trim();
      const org = document.getElementById('newEvOrg').value.trim();
      const fee = parseInt(document.getElementById('newEvFee').value) || 5000000;
      const displayDate = document.getElementById('newEvDisplayDate').value.trim();
      const platform = document.getElementById('newEvPlatform').value.trim();
      const reqsRaw = document.getElementById('newEvReqs').value.split('\n');

      if (!game || !title) {
        alert('Mohon isi nama game dan judul event.');
        return;
      }

      const requirements = reqsRaw.map(r => r.trim()).filter(Boolean);

      const newEv = {
        id: 'event-' + Date.now(),
        title,
        game,
        badgeColor: '#4facfe',
        bannerImage: '/assets/event_banner.jpg',
        date: '2026-10-30T19:00:00',
        displayDate: displayDate || 'Segera Diumumkan',
        platform: platform || 'TikTok Live',
        organizer: org || 'Publisher',
        creatorFee: fee,
        status: 'Upcoming',
        targetAccount: Object.values(data.accounts || {})[0]?.handle || '@creator',
        requirements: requirements.length ? requirements : ['Live stream official event'],
        prepChecklist: [
          { task: 'Download Asset & Overlay sponsor', done: false },
          { task: 'Tes Mikrofon & Game Capture', done: false },
          { task: 'Setting TikTok Live Stream Key', done: false }
        ]
      };

      data.gameEvents.push(newEv);
      saveStudioData(data);

      modal.classList.remove('open');
      if (onShowToast) onShowToast(`Event game "${title}" berhasil ditambahkan!`);
      renderGameEventsView(data, onAskAiEvent, onShowToast);
    });
  }

  modal.classList.add('open');
}
