// ═══════════════════════════════════════════════════════
//  THE INTERN HUB — Global Notification System
//  Messages: polling every 10s (no realtime setup needed)
//  Announcements: modal on login, remembered via localStorage
// ═══════════════════════════════════════════════════════

(function() {

// ─── Inject Styles ──────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
/* ── Floating message notification ── */
#notif-tray {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 8000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 320px;
}
.msg-notif {
  background: #111418;
  border: 1px solid rgba(56,189,248,.35);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(56,189,248,.1);
  pointer-events: all;
  cursor: pointer;
  animation: notifIn .35s cubic-bezier(.175,.885,.32,1.275);
  transition: opacity .3s, transform .3s;
  text-decoration: none;
  max-width: 320px;
}
.msg-notif:hover { border-color: rgba(56,189,248,.6); background: #161b22; }
.msg-notif.out { opacity: 0; transform: translateX(20px); }
.msg-notif-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: "Share Tech Mono", monospace;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.msg-notif-body { flex: 1; min-width: 0; }
.msg-notif-name {
  font-family: "Share Tech Mono", monospace;
  font-size: 11px; color: #38bdf8;
  letter-spacing: .08em; margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.msg-notif-text {
  font-family: "DM Sans", sans-serif;
  font-size: 13px; color: #e6edf3; line-height: 1.4;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.msg-notif-close {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255,255,255,.06); border: none;
  color: #7d8590; font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .15s, color .15s;
}
.msg-notif-close:hover { background: rgba(248,81,73,.15); color: #f85149; }
@keyframes notifIn {
  from { opacity: 0; transform: translateX(20px) scale(.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

/* ── Announcement modal ── */
#ann-modal-ov {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  animation: fadeIn .25s ease;
}
#ann-modal-ov.hidden { display: none; }
#ann-modal {
  background: #111418;
  border: 1px solid rgba(163,113,247,.4);
  border-radius: 18px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 0 60px rgba(163,113,247,.15), 0 24px 48px rgba(0,0,0,.6);
  animation: modalIn .35s cubic-bezier(.175,.885,.32,1.275);
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(.9) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.ann-modal-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(163,113,247,.12);
  border: 1px solid rgba(163,113,247,.3);
  border-radius: 20px; padding: 4px 12px;
  font-family: "Share Tech Mono", monospace;
  font-size: 9px; color: #a371f7;
  letter-spacing: .18em; text-transform: uppercase;
  margin-bottom: 18px;
}
.ann-modal-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px; letter-spacing: .08em;
  color: #e6edf3; line-height: 1.1; margin-bottom: 14px;
}
.ann-modal-body {
  font-family: "DM Sans", sans-serif;
  font-size: 14px; color: #7d8590;
  line-height: 1.7; margin-bottom: 10px;
}
.ann-modal-meta {
  font-family: "Share Tech Mono", monospace;
  font-size: 9px; color: #484f58;
  letter-spacing: .12em; margin-bottom: 24px;
}
.ann-modal-multi {
  font-family: "Share Tech Mono", monospace;
  font-size: 9px; color: #38bdf8;
  letter-spacing: .1em; margin-bottom: 8px;
}
.ann-modal-dots { display: flex; gap: 6px; margin-bottom: 24px; }
.ann-modal-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #21262d; cursor: pointer; transition: background .2s;
}
.ann-modal-dot.active { background: #a371f7; }
.ann-modal-actions { display: flex; gap: 10px; }
.ann-modal-btn {
  flex: 1; padding: 11px;
  border-radius: 8px;
  font-family: "Share Tech Mono", monospace;
  font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
  cursor: pointer; transition: all .15s; border: none;
}
.ann-modal-btn.primary { background: #a371f7; color: #000; font-weight: 700; }
.ann-modal-btn.primary:hover { background: #b48ffb; }
.ann-modal-btn.ghost { background: none; border: 1px solid #30363d; color: #7d8590; }
.ann-modal-btn.ghost:hover { border-color: #a371f7; color: #a371f7; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@media(max-width:480px){
  #notif-tray { bottom: 80px; right: 12px; left: 12px; max-width: 100%; }
  #ann-modal { padding: 24px; }
  .ann-modal-title { font-size: 22px; }
}
`;
document.head.appendChild(style);

// ─── Inject Tray ────────────────────────────────────────
const tray = document.createElement('div');
tray.id = 'notif-tray';
document.body.appendChild(tray);

// ─── Inject Announcement Modal ──────────────────────────
const modalOv = document.createElement('div');
modalOv.id = 'ann-modal-ov';
modalOv.className = 'hidden';
modalOv.innerHTML = `<div id="ann-modal"></div>`;
document.body.appendChild(modalOv);

// ─── Helpers ────────────────────────────────────────────
function avatarColor(name='') {
  const colors = ['#38bdf8','#58a6ff','#3fb950','#a371f7','#f85149','#f0883e'];
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
function avatarInitials(name='') {
  return name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?';
}
function timeAgo(ts) {
  const s = ts.endsWith('Z') || ts.includes('+') ? ts : ts + 'Z';
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

// ─── Message Floating Notification ─────────────────────
window.HubNotif = {
  showMessage(senderName, text, senderId) {
    const col = avatarColor(senderName);
    const el = document.createElement('a');
    el.className = 'msg-notif';
    el.href = `chat.html?uid=${senderId}`;
    el.innerHTML = `
      <div class="msg-notif-avatar" style="background:${col}20;color:${col}">${avatarInitials(senderName)}</div>
      <div class="msg-notif-body">
        <div class="msg-notif-name">${senderName}</div>
        <div class="msg-notif-text">${text}</div>
      </div>
      <button class="msg-notif-close" onclick="event.preventDefault();event.stopPropagation();HubNotif._dismiss(this.closest('.msg-notif'))">✕</button>
    `;
    tray.appendChild(el);
    setTimeout(() => HubNotif._dismiss(el), 6000);
  },
  _dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }
};

// ─── Message Polling ─────────────────────────────────────
// Polls every 10 seconds — works without enabling realtime on the table
window.HubMsgPoller = {
  _sb: null,
  _userId: null,
  _lastTs: null,
  _timer: null,
  _onChat: false, // suppress notifs on the chat page itself

  start(sb, userId) {
    this._sb = sb;
    this._userId = userId;
    this._lastTs = new Date().toISOString();
    // Check if we're on chat page — don't show notifs there
    this._onChat = window.location.pathname.includes('chat.html');
    if (this._onChat) return;
    this._timer = setInterval(() => this._poll(), 10000);
  },

  async _poll() {
    if (!this._sb || !this._userId) return;
    try {
      const { data } = await this._sb
        .from('messages')
        .select('*, sender:sender_id(name)')
        .eq('receiver_id', this._userId)
        .gt('created_at', this._lastTs)
        .order('created_at', { ascending: true });

      if (!data || data.length === 0) return;
      this._lastTs = data[data.length - 1].created_at;

      // Group by sender — show one notif per sender
      const bySender = {};
      for (const m of data) {
        bySender[m.sender_id] = { name: m.sender?.name || 'Someone', text: m.message, id: m.sender_id };
      }
      for (const s of Object.values(bySender)) {
        HubNotif.showMessage(s.name, s.text, s.id);
      }

      // Refresh convos/messages if the page has that function
      if (typeof loadMessages === 'function') loadMessages();
      if (typeof loadConvos === 'function') loadConvos();
    } catch(e) {
      // Silently ignore polling errors
    }
  },

  stop() {
    if (this._timer) clearInterval(this._timer);
  }
};

// ─── Announcement Modal ─────────────────────────────────
window.HubAnnouncements = {
  _anns: [],
  _idx: 0,

  async checkOnLogin(sb, userId) {
    try {
      const { data } = await sb.from('announcements')
        .select('*, users(name)')
        .order('created_at', { ascending: false });
      if (!data || data.length === 0) return;

      const key = `ann_seen_${userId}`;
      const seen = JSON.parse(localStorage.getItem(key) || '[]');
      const unseen = data.filter(a => !seen.includes(a.id));
      if (unseen.length === 0) return;

      this._anns = unseen;
      this._idx = 0;
      this._show(userId, key, seen);
    } catch(e) {
      // Silently ignore
    }
  },

  _show(userId, key, seen) {
    const ann = this._anns[this._idx];
    if (!ann) return;
    const total = this._anns.length;
    const isLast = this._idx === total - 1;
    const modal = document.getElementById('ann-modal');
    const dotsHtml = total > 1
      ? `<div class="ann-modal-multi">Announcement ${this._idx + 1} of ${total}</div>
         <div class="ann-modal-dots">${this._anns.map((_,i) =>
           `<span class="ann-modal-dot${i===this._idx?' active':''}"></span>`
         ).join('')}</div>`
      : '';

    // Safely encode for inline onclick
    const safeKey = key;
    const safeSeen = JSON.stringify(seen);

    modal.innerHTML = `
      <div class="ann-modal-badge">📣 Announcement</div>
      <div class="ann-modal-title">${ann.title}</div>
      <div class="ann-modal-body">${ann.message}</div>
      <div class="ann-modal-meta">${ann.users?.name || 'Admin'} · ${timeAgo(ann.created_at)}</div>
      ${dotsHtml}
      <div class="ann-modal-actions">
        <button class="ann-modal-btn ghost" id="annDismissBtn">Dismiss All</button>
        <button class="ann-modal-btn primary" id="annNextBtn">${isLast ? 'Got it ✓' : 'Next →'}</button>
      </div>
    `;

    document.getElementById('annDismissBtn').onclick = () => this._dismissAll(userId);
    document.getElementById('annNextBtn').onclick = () => {
      if (isLast) this._dismissAll(userId);
      else { this._markCurrentSeen(userId); this._idx++; this._show(userId, key, this._getSeen(userId)); }
    };

    document.getElementById('ann-modal-ov').classList.remove('hidden');
  },

  _getSeen(userId) {
    return JSON.parse(localStorage.getItem(`ann_seen_${userId}`) || '[]');
  },

  _markCurrentSeen(userId) {
    const ann = this._anns[this._idx];
    if (!ann) return;
    const key = `ann_seen_${userId}`;
    const seen = this._getSeen(userId);
    if (!seen.includes(ann.id)) {
      localStorage.setItem(key, JSON.stringify([...seen, ann.id]));
    }
  },

  _dismissAll(userId) {
    const allIds = this._anns.map(a => a.id);
    const seen = this._getSeen(userId);
    localStorage.setItem(`ann_seen_${userId}`, JSON.stringify([...new Set([...seen, ...allIds])]));
    document.getElementById('ann-modal-ov').classList.add('hidden');
  }
};

})();
