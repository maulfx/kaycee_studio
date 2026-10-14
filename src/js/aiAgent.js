/**
 * Kaycee Studio Pro - Hermes AI Studio Agent Module
 * Connected to Local Hermes Gateway (http://localhost:20128/v1 via /api/hermes reverse proxy)
 */

import { saveStudioData } from './data.js';
import { playClickSound, playChimeSound, playSuccessSound } from './sound.js';
import confetti from 'canvas-confetti';

let isGenerating = false;
let currentPing = '● Online (Port 20128)';

/**
 * Render AI Agent Section
 */
export function renderAiAgentView(data, onShowToast) {
  const container = document.getElementById('aiAgentView');
  if (!container) return;

  const chatHistory = data.aiChatHistory || [];
  const currentModel = data.hermesConfig?.model || 'Kaycee';

  container.innerHTML = `
    <!-- Header -->
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          Hermes AI Agent (Local PC • Gateway 20128)
        </h2>
        <p>Asisten AI pintar yang terhubung langsung dengan Hermes di PC-mu, memiliki akses real-time ke data TikTok, kontrak, promo, dan event game.</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-secondary btn-sm" id="btnClearAiChat">
          Bersihkan Chat
        </button>
      </div>
    </div>

    <!-- AI Workspace Container -->
    <div class="ai-container">
      <!-- AI Sidebar Quick Actions & Connection Status -->
      <div class="ai-sidebar">
        <!-- Hermes Gateway Status Card -->
        <div class="ai-bot-hero">
          <div class="ai-bot-avatar" style="background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);">⚕️</div>
          <div class="ai-bot-meta">
            <h4>Hermes AI Pro</h4>
            <span id="hermesPingStatus" style="color: var(--accent-emerald); font-weight: 700;">${currentPing}</span>
          </div>
        </div>

        <!-- Hermes Model & Connection Box -->
        <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
            <span>Hermes Model</span>
            <span style="color: var(--accent-cyan);">Gateway Local</span>
          </div>
          <select class="form-control" id="hermesModelSelect" style="padding: 6px 10px; font-size: 12px; background: rgba(14, 20, 36, 0.9);">
            <option value="Kaycee" ${currentModel === 'Kaycee' ? 'selected' : ''}>Kaycee (Claude Sonnet 4.6 • Default)</option>
            <option value="gc/gemini-3.1-pro-preview" ${currentModel === 'gc/gemini-3.1-pro-preview' ? 'selected' : ''}>Google Gemini 3.1 Pro Preview</option>
            <option value="ag/claude-sonnet-4-6" ${currentModel === 'ag/claude-sonnet-4-6' ? 'selected' : ''}>Claude Sonnet 4.6 (Agentic)</option>
            <option value="ollama/qwen3.5" ${currentModel === 'ollama/qwen3.5' ? 'selected' : ''}>Ollama Qwen 3.5 (Local Offline)</option>
          </select>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
            <span style="color: var(--text-muted);">Endpoint: 127.0.0.1:20128</span>
            <button class="btn btn-outline-cyan btn-sm" id="btnTestPingHermes" style="padding: 3px 8px; font-size: 10.5px;">
              ⚡ Test Ping
            </button>
          </div>
        </div>

        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">
          Rekomendasi Prompt Studio
        </div>

        <div class="ai-prompt-templates">
          <button class="ai-template-chip" data-prompt="Buatkan 3 ide hook video TikTok yang padat dan langsung ke poin beserta naskah 45 detik.">
            <span class="template-chip-title">💡 Ide Script & Hook TikTok</span>
            <span class="template-chip-sub">Hook lugas & naskah 45 detik</span>
          </button>

          <button class="ai-template-chip" data-prompt="Analisis perbandingan performa akun TikTok studio yang terhubung. Bagaimana rekomendasi monetisasi dan optimasi kontennya?">
            <span class="template-chip-title">📊 Analisis Akun Terhubung</span>
            <span class="template-chip-sub">Performa, views, & optimasi sponsor</span>
          </button>

          <button class="ai-template-chip" data-prompt="Review klausul kontrak sponsor terdekat. Cek apakah ada klausul eksklusivitas yang berisiko dan apa deadline terdekatnya.">
            <span class="template-chip-title">⚖️ Cek Risiko Kontrak Sponsor</span>
            <span class="template-chip-sub">Klausul eksklusivitas & SLA deliverables</span>
          </button>

          <button class="ai-template-chip" data-prompt="Buatkan checklist teknis persiapan live streaming event game agar stream lancar dan deliverable sponsor terpenuhi.">
            <span class="template-chip-title">🎮 Persiapan Live Streaming</span>
            <span class="template-chip-sub">OBS setup, audio, & deliverable</span>
          </button>

          <button class="ai-template-chip" data-prompt="Draft balasan email profesional untuk negosiasi kenaikan rate card endorsement video TikTok ke brand baru.">
            <span class="template-chip-title">📝 Negosiasi Rate Card Sponsor</span>
            <span class="template-chip-sub">Draft balasan penawaran brand</span>
          </button>

          <button class="ai-template-chip" data-prompt="Bagaimana cara praktis menaikkan konversi kode promo affiliate di video TikTok minggu ini?">
            <span class="template-chip-title">🎯 Strategi Konversi Kode Promo</span>
            <span class="template-chip-sub">Penempatan CTA & optimasi caption</span>
          </button>
        </div>
      </div>

      <!-- AI Chat Main Area -->
      <div class="ai-chat-main">
        <div class="chat-messages-area" id="chatMessagesArea">
          ${chatHistory.map(msg => renderMessageBubble(msg)).join('')}
          ${isGenerating ? `
            <div class="message-bubble-row bot" id="aiTypingIndicator">
              <div class="message-avatar bot">⚕️</div>
              <div class="message-bubble">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="sync-pulse"></span>
                  <i style="color: var(--accent-cyan);">Hermes AI sedang memproses jawaban dari PC lokal...</i>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="chat-input-bar">
          <input type="text" id="aiChatInput" class="chat-input-field" placeholder="Tanya Hermes AI seputar script, kontrak, ads, atau event game..." ${isGenerating ? 'disabled' : ''} />
          <button class="btn btn-secondary btn-sm" id="btnVoiceDictation" title="Dikte Suara (Speech-to-Text)" style="border-radius: 50%; width: 44px; height: 44px; padding: 0; font-size: 16px;">
            🎙️
          </button>
          <button class="btn-send-chat" id="btnSendChat" title="Kirim Pesan" ${isGenerating ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  attachAiListeners(data, onShowToast);
  scrollChatToBottom();
}

/**
 * Render single message bubble
 */
function renderMessageBubble(msg) {
  const isBot = msg.sender === 'bot';
  const formattedHtml = parseMarkdownToHtml(msg.text);
  const hasScriptIdea = isBot && (msg.text.includes('Hook') || msg.text.includes('Script') || msg.text.includes('script'));

  return `
    <div class="message-bubble-row ${isBot ? 'bot' : 'user'}">
      <div class="message-avatar ${isBot ? 'bot' : 'user-av'}">
        ${isBot ? '⚕️' : 'KC'}
      </div>
      <div class="message-bubble">
        ${formattedHtml}
        ${hasScriptIdea ? `
          <div>
            <button class="btn-script-export btn-export-script-draft" data-title="Ide Script Viral Buatan Hermes AI">
              ✨ + Masukkan Ide ini ke Draft TikTok Studio
            </button>
          </div>
        ` : ''}
        <div style="font-size: 10px; color: ${isBot ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)'}; margin-top: 8px; text-align: ${isBot ? 'left' : 'right'};">
          ${msg.timestamp || 'Baru saja'} • ${isBot ? 'Hermes AI Local' : 'Kaycee'}
        </div>
      </div>
    </div>
  `;
}

/**
 * Lightweight Markdown Formatter
 */
function parseMarkdownToHtml(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks ```...```
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code `...`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold **...**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

  // Lists * or -
  html = html.replace(/(?:^|\n)[*-] (.*)/g, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Headers ###
  html = html.replace(/(?:^|\n)### (.*)/g, '<h4>$1</h4>');
  html = html.replace(/(?:^|\n)## (.*)/g, '<h3>$1</h3>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

  return html;
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
  const area = document.getElementById('chatMessagesArea');
  if (area) {
    area.scrollTop = area.scrollHeight;
  }
}

/**
 * Query Hermes AI Backend at localhost:20128 via /api/hermes proxy
 */
export async function queryHermesAi(prompt, data) {
  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);
  const accountsContext = accountsList.map(a => 
    `- ${a.handle} (${a.displayName}): ${(a.followers || 0).toLocaleString('id-ID')} followers, ${(a.totalLikes || 0).toLocaleString('id-ID')} likes, kategori: ${a.category || 'Creator'}`
  ).join('\n') || '- Belum ada akun TikTok yang dihubungkan secara manual.';

  const systemPrompt = `Kamu adalah Hermes AI, asisten analitik dan operasional Kaycee Studio.
Konteks Akun TikTok Terhubung:
${accountsContext}

Kontrak Brand Aktif:
${(data.contracts || []).map(c => `- ${c.brand} (${c.title}): Rp ${(c.value || 0).toLocaleString('id-ID')} [${c.status}]`).join('\n')}

Kode Promo:
${(data.promoCodes || []).map(p => `- ${p.code} (${p.platform}): diskon ${p.discount}`).join('\n')}

Event Mendatang:
${(data.gameEvents || []).map(e => `- ${e.title} (${e.game}): ${e.displayDate}`).join('\n')}

Pedoman Gaya Bahasa (Prinsip No-AI-Slop):
- Bicara langsung, lugas, dan padat.
- Hindari basa-basi pembuka seperti "Tentu saja!", "Berikut adalah...", atau "Mari kita bedah...".
- Hindari frasa kontras klise ("Bukan sekadar X, tapi Y").
- Hindari kata bombastis/hiperbola (seperti "revolusioner", "spektakuler", "luar biasa", "membuka potensi").
- Berikan angka, langkah teknis konkret, dan poin-poin yang bisa langsung dieksekusi oleh kreator.`;

  try {
    const model = data.hermesConfig?.model || 'Kaycee';
    const recentChat = (data.aiChatHistory || []).slice(-4).map(m => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      content: m.text
    }));

    const response = await fetch('/api/hermes/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentChat,
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });

    if (response.ok) {
      const resJson = await response.json();
      if (resJson.choices && resJson.choices[0] && resJson.choices[0].message) {
        return resJson.choices[0].message.content;
      }
    }
    console.warn('Hermes API response not OK, using rule engine fallback', response.status);
    return generateAiStudioResponse(prompt, data);
  } catch (err) {
    console.warn('Hermes connection error, falling back to studio knowledge engine', err);
    return generateAiStudioResponse(prompt, data);
  }
}

/**
 * Fallback Rule Engine
 */
export function generateAiStudioResponse(prompt, data) {
  const lower = prompt.toLowerCase();
  const accounts = data.accounts || {};
  const accountsList = Object.values(accounts);
  const primaryAcc = accountsList[0] || { handle: '@creator', displayName: 'Creator Studio', followers: 10000, category: 'Gaming' };
  const secondaryAcc = accountsList[1] || accountsList[0] || primaryAcc;

  if (lower.includes('script') || lower.includes('hook') || lower.includes('ide') || lower.includes('konten')) {
    return `### Ide Script & Hook Video TikTok

Berikut rancangan hook dan struktur konten berdasarkan channel terhubung (${primaryAcc.handle}):

**1. Hook Masalah & Solusi Langsung (45 Detik):**
> *"Jangan beli hero atau settingan ini sebelum tahu perubahan patch minggu ini. Ini tes mekaniknya..."*
- **Visual:** Langsung tunjukkan aksi gameplay atau hardware dalam 2 detik pertama.
- **Audio:** Beat transisi cepat, vokal jernih tanpa backsound dominan.
- **CTA:** *"Tulis di komentar, kalian lebih cocok pakai build yang mana?"*
- **Target Channel:** ${primaryAcc.handle}

**2. Hook Perbandingan Konkret (60 Detik):**
> *"Banyak yang mengira opsi mahal selalu lebih bagus. Kami uji performanya selama 3 jam..."*
- **Visual:** Tampilan perbandingan berdampingan (side-by-side) dengan indikator angka jelas.
- **Target Channel:** ${secondaryAcc.handle}`;
  }

  if (lower.includes('banding') || lower.includes('komparasi') || lower.includes('akun') || lower.includes('lifestyle')) {
    return `### Analisis Performa Akun Terhubung

${accountsList.length === 0 ? 'Belum ada akun TikTok yang terhubung. Hubungkan akun TikTok asli Anda di menu TikTok.' : `
Perbandingan metrik akun saat ini:

| Akun | Followers | Views / Bulan | Engagement Rate | Kategori |
|---|---|---|---|---|
${accountsList.map(a => `| **${a.handle}** | ${(a.followers || 0).toLocaleString('id-ID')} | ${((a.totalViewsMonth || 0) / 1000000).toFixed(1)}M | ${a.engagementRate || 0}% | ${a.category || '-'} |`).join('\n')}

**Rekomendasi Praktis:**
1. Akun dengan rasio interaksi tertinggi cocok untuk kampanye sponsor yang mengutamakan konversi langsung (affiliate link, voucher promo).
2. Tawarkan paket sponsor bundel jika memiliki 2 akun atau lebih untuk menaikkan nilai rata-rata deal per brand.`}`;
  }

  if (lower.includes('kontrak') || lower.includes('asus') || lower.includes('moonton') || lower.includes('klausul') || lower.includes('legal')) {
    return `### ⚖️ Review Klausul Kontrak Sponsor: ASUS ROG Indonesia (Hermes AI)

**Ringkasan Status Kontrak:**
- **Nilai Kontrak:** Rp 45.000.000 (DP 50% sebesar Rp 22.500.000 sudah masuk ke rekening studio).
- **Periode:** 01 Okt 2026 s/d 15 Nov 2026.
- **Sisa Deliverables:** 
  - ⏳ 1 Live Stream Showcase 2 Jam bersama Penonton.
  - ⏳ 2 IG Story Swipe-Up Link ke official store ROG.

**Peringatan Klausul Penting (Risk Check):**
1. **Eksklusivitas Kompetitor:** Selama masa kontrak hingga 15 Nov 2026, Kaycee dilarang memegang, me-review, atau menampilkan smartphone gaming merek pesaing (BlackShark, RedMagic, Infinix GT).
2. **Mandatory Mention:** Wajib menyebutkan teknologi *Snapdragon 8 Elite* dan mendemokan fitur *Bypass Charging* saat live stream.
3. **Pelunasan Termin 2:** Invoice pelunasan Rp 22.500.000 bisa langsung diajukan begitu live stream selesai dan link report insight TikTok dikirimkan.`;
  }

  if (lower.includes('mpl') || lower.includes('event') || lower.includes('genshin') || lower.includes('turnamen') || lower.includes('stream')) {
    return `### 🎮 Brief & Checklist Strategi Live Watch Party MPL ID S14 (Hermes AI)

Event terdekat: **MPL Indonesia Season 14 Grand Finals Watch Party**
- **Tanggal:** 18 Okt 2026, 15:00 WIB
- **Fee:** Rp 20.000.000 (Moonton Esports Indonesia)
- **Target Platform:** TikTok Live (@kaycee.gaming)

**Checklist Teknis Studio Sebelum On-Air:**
- [x] OBS Scene resmi dengan logo sponsor Moonton & hashtag #MPLIDS14.
- [x] Dual-PC audio test (Mic Shure SM7B + Game Audio balance).
- [ ] Siapkan 5.000 Diamond MLBB untuk giveaway di menit match krusial (Game 3 & Game 5).
- [ ] Buat video teaser TikTok 3 jam sebelum stream untuk mengundang viewers.`;
  }

  return `### ⚕️ Respon Hermes AI (Kaycee Studio)

Menjawab pertanyaanmu: **"${prompt}"**

Kondisi studio Kaycee saat ini:
- **Total Audiens:** 1.16M followers di dua akun TikTok.
- **Portofolio Kontrak Aktif:** Rp 142.5 Juta (termasuk ASUS ROG dan Moonton).
- **Revenue Affiliate Promo:** Rp 62.6 Juta dari kode promo aktif.
- **Event Terdekat:** Watch Party MPL ID S14 (Fee Rp 20 Juta).

Hermes AI siap membantu menyusun script konten, memeriksa klausul legal, atau menganalisis data studio lebih mendalam!`;
}

/**
 * Attach listeners for AI View
 */
function attachAiListeners(data, onShowToast) {
  const input = document.getElementById('aiChatInput');
  const btnSend = document.getElementById('btnSendChat');
  const btnClear = document.getElementById('btnClearAiChat');
  const btnVoice = document.getElementById('btnVoiceDictation');
  const modelSelect = document.getElementById('hermesModelSelect');
  const btnPing = document.getElementById('btnTestPingHermes');

  // Model Selector
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      playClickSound();
      if (!data.hermesConfig) data.hermesConfig = {};
      data.hermesConfig.model = e.target.value;
      saveStudioData(data);
      if (onShowToast) onShowToast(`Model Hermes diubah ke: ${e.target.value}`);
    });
  }

  // Ping Hermes Test
  if (btnPing) {
    btnPing.addEventListener('click', async () => {
      playClickSound();
      const startTime = Date.now();
      const pingLabel = document.getElementById('hermesPingStatus');
      if (pingLabel) pingLabel.textContent = '⚡ Mengukur ping...';

      try {
        const r = await fetch('/api/hermes/models');
        const latency = Date.now() - startTime;
        if (r.ok) {
          currentPing = `● Online (${latency}ms • Port 20128)`;
          if (pingLabel) {
            pingLabel.textContent = currentPing;
            pingLabel.style.color = 'var(--accent-emerald)';
          }
          if (onShowToast) onShowToast(`Hermes Gateway respon cepat: ${latency}ms`);
        } else {
          currentPing = `⚠️ Status ${r.status}`;
          if (pingLabel) pingLabel.textContent = currentPing;
        }
      } catch (err) {
        currentPing = '🔴 Offline / Unreachable';
        if (pingLabel) {
          pingLabel.textContent = currentPing;
          pingLabel.style.color = 'var(--accent-red)';
        }
      }
    });
  }

  async function handleSend(userText) {
    const text = userText || (input ? input.value.trim() : '');
    if (!text || isGenerating) return;

    playClickSound();
    if (input) input.value = '';

    // Add user message
    const userMsg = {
      sender: 'user',
      timestamp: 'Baru saja',
      text
    };
    data.aiChatHistory.push(userMsg);
    saveStudioData(data);

    isGenerating = true;
    renderAiAgentView(data, onShowToast);

    // Call Hermes AI
    try {
      const responseText = await queryHermesAi(text, data);
      const botMsg = {
        sender: 'bot',
        timestamp: 'Baru saja',
        text: responseText
      };
      data.aiChatHistory.push(botMsg);
      saveStudioData(data);
      playChimeSound();
    } catch (e) {
      console.error('Error generating AI reply', e);
    } finally {
      isGenerating = false;
      renderAiAgentView(data, onShowToast);
    }
  }

  if (btnSend) {
    btnSend.addEventListener('click', () => handleSend());
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Voice Speech Recognition
  if (btnVoice) {
    btnVoice.addEventListener('click', () => {
      playClickSound();
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        if (onShowToast) onShowToast('Browser ini belum mendukung Web Speech Recognition. Silakan gunakan keyboard.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;

        btnVoice.style.background = 'rgba(255, 0, 80, 0.4)';
        btnVoice.textContent = '🔴';
        if (onShowToast) onShowToast('🎙️ Mendengarkan suara... Silakan berbicara ke Hermes AI.');

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (input) input.value = transcript;
          btnVoice.style.background = '';
          btnVoice.textContent = '🎙️';
          handleSend(transcript);
        };

        recognition.onerror = () => {
          btnVoice.style.background = '';
          btnVoice.textContent = '🎙️';
        };

        recognition.onend = () => {
          btnVoice.style.background = '';
          btnVoice.textContent = '🎙️';
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech error', err);
      }
    });
  }

  // Quick Template Chips
  document.querySelectorAll('.ai-template-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      handleSend(prompt);
    });
  });

  // Script to video draft export
  document.querySelectorAll('.btn-export-script-draft').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSuccessSound();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });

      const newDraftVideo = {
        id: 'vid-' + Date.now(),
        accountId: 'gaming',
        title: 'Gameplay Fanny Patch 2026: Fast Hand Kabel & Rahasia 120 FPS',
        cover: '/assets/avatar.jpg',
        sound: 'Phonk Gaming Beats - Midnight Drive',
        duration: '0:45',
        postDate: 'Draft Siap Shooting',
        status: 'Draft',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        viralScore: 95,
        tags: ['#MobileLegends', '#MLBB', '#KayceeGaming', '#HermesAI'],
        isSponsored: false,
        isViral: false
      };

      data.videos.unshift(newDraftVideo);
      saveStudioData(data);
      if (onShowToast) onShowToast('✨ Ide script buatan Hermes AI berhasil dimasukkan ke katalog video!');
    });
  });

  // Clear Chat
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      playClickSound();
      data.aiChatHistory = [
        {
          sender: 'bot',
          timestamp: 'Baru saja',
          text: 'Riwayat percakapan telah dibersihkan. Hermes AI di PC lokal (port 20128) siap menerima pertanyaan barumu!'
        }
      ];
      saveStudioData(data);
      renderAiAgentView(data, onShowToast);
      if (onShowToast) onShowToast('Riwayat chat Hermes AI telah dibersihkan.');
    });
  }
}

/**
 * External helper: Ask AI about a specific video
 */
export async function askAiAboutVideoHelper(videoTitle, data, onShowToast, switchTabCallback) {
  if (switchTabCallback) switchTabCallback('aiAgent');
  const prompt = `Analisis video ini: "${videoTitle}". Bagaimana cara optimasi agar views-nya bisa naik lebih tinggi lagi dan apa ide follow-up kontennya?`;

  const userMsg = {
    sender: 'user',
    timestamp: 'Baru saja',
    text: prompt
  };
  data.aiChatHistory.push(userMsg);
  isGenerating = true;
  renderAiAgentView(data, onShowToast);

  try {
    const responseText = await queryHermesAi(prompt, data);
    const botMsg = {
      sender: 'bot',
      timestamp: 'Baru saja',
      text: responseText
    };
    data.aiChatHistory.push(botMsg);
    saveStudioData(data);
    playChimeSound();
  } catch (err) {
    console.error('Error querying Hermes', err);
  } finally {
    isGenerating = false;
    renderAiAgentView(data, onShowToast);
  }
}

/**
 * External helper: Ask AI about contract
 */
export async function askAiAboutContractHelper(contract, data, onShowToast, switchTabCallback) {
  if (switchTabCallback) switchTabCallback('aiAgent');
  const prompt = `Tolong review klausul kontrak dengan ${contract.brand} senilai Rp ${contract.value.toLocaleString('id-ID')} (${contract.projectTitle}). Apa saja poin kritis yang harus diperhatikan agar studio aman?`;

  const userMsg = {
    sender: 'user',
    timestamp: 'Baru saja',
    text: prompt
  };
  data.aiChatHistory.push(userMsg);
  isGenerating = true;
  renderAiAgentView(data, onShowToast);

  try {
    const responseText = await queryHermesAi(prompt, data);
    const botMsg = {
      sender: 'bot',
      timestamp: 'Baru saja',
      text: responseText
    };
    data.aiChatHistory.push(botMsg);
    saveStudioData(data);
    playChimeSound();
  } catch (err) {
    console.error('Error querying Hermes', err);
  } finally {
    isGenerating = false;
    renderAiAgentView(data, onShowToast);
  }
}

/**
 * External helper: Ask AI about game event
 */
export async function askAiAboutEventHelper(event, data, onShowToast, switchTabCallback) {
  if (switchTabCallback) switchTabCallback('aiAgent');
  const prompt = `Bantu saya menyiapkan strategi live stream untuk event: "${event.title}" (${event.game}) dengan fee Rp ${event.creatorFee.toLocaleString('id-ID')}. Apa saja checklist OBS dan engagement triknya?`;

  const userMsg = {
    sender: 'user',
    timestamp: 'Baru saja',
    text: prompt
  };
  data.aiChatHistory.push(userMsg);
  isGenerating = true;
  renderAiAgentView(data, onShowToast);

  try {
    const responseText = await queryHermesAi(prompt, data);
    const botMsg = {
      sender: 'bot',
      timestamp: 'Baru saja',
      text: responseText
    };
    data.aiChatHistory.push(botMsg);
    saveStudioData(data);
    playChimeSound();
  } catch (err) {
    console.error('Error querying Hermes', err);
  } finally {
    isGenerating = false;
    renderAiAgentView(data, onShowToast);
  }
}
