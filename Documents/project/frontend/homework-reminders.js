// homework-reminders.js — one quiet reminder in the evening, if the student asked for it.
//
// Off until switched on: it is offered once, after the first homework is
// added, and after that it lives in Settings. At most one a day, at half past
// six or later and never after half past eight (nothing late in the evening),
// only when homework is due today or tomorrow or already late, and never while
// a focus session runs. The words are plain: what is due, nothing about
// streaks, friends, or being missed.
//
// A Windows notification through the desktop app (the same door the break
// reminders use), and a toast when Climby is the window in front.
const HomeworkReminders = (() => {
  const PREF = 'climby-hw-remind';            // 'off' turns them off on this device
  const SENT = 'climby-hw-reminded:';         // + account id: { day, sent: ['early'|'late'] }
  const FROM = 18 * 60 + 30;
  const UNTIL = 20 * 60 + 30;                 // quiet after this
  const ASKED = 'climby-hw-asked';            // the one-time offer has been made
  const CHECK_MS = 5 * 60 * 1000;
  let timer = null;

  const t = (k, v) => (window.t ? window.t(k, v) : k);

  function enabled() {
    try { return localStorage.getItem(PREF) === 'on'; } catch { return false; }
  }

  function setEnabled(on) {
    try { localStorage.setItem(PREF, on ? 'on' : 'off'); } catch { /* this visit only */ }
    paint();
  }

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function sentToday(uid) {
    try {
      const s = JSON.parse(localStorage.getItem(SENT + uid) || 'null');
      return s && s.day === today() && Array.isArray(s.sent) ? s.sent : [];
    } catch { return []; }
  }

  function markSent(uid, id) {
    const sent = sentToday(uid).concat(id);
    try { localStorage.setItem(SENT + uid, JSON.stringify({ day: today(), sent })); } catch { /* may repeat once */ }
  }

  // Is a reminder due now: inside the evening window and none sent today.
  function dueSlot(uid, minutes) {
    if (minutes < FROM || minutes >= UNTIL) return null;
    return sentToday(uid).length ? null : { id: 'evening' };
  }

  function notify(title, body) {
    const bridge = window.CLIMBY_DESKTOP;
    if (bridge && typeof bridge.notify === 'function') {
      bridge.notify({ title, body, tag: 'climby-homework' }).catch(() => {});
    } else {
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, tag: 'climby-homework', icon: 'icon-192.png' });
        }
      } catch { /* the toast is still there */ }
    }
    if (window.Toast && document.visibilityState === 'visible') Toast.show(body);
  }

  let checking = false;
  async function check() {
    if (!enabled() || !window.Auth || !Auth.isLoggedIn() || !window.Checklist) return;
    if (document.body.classList.contains('focus-live')) return;
    const user = Auth.getUser();
    if (!user || !user.id || (user.role && user.role !== 'student')) return;
    const now = new Date();
    const slot = dueSlot(String(user.id), now.getHours() * 60 + now.getMinutes());
    if (!slot) return;
    // Two checks can pass the slot test at once (the timer and the window
    // coming back after sleep); only one may go on to notify.
    if (checking) return;
    checking = true;
    let pending;
    try { pending = await Checklist.getPendingTasks(); } catch { return; } finally { checking = false; }
    const soon = pending.filter(task => {
      const d = Checklist.daysUntil(task.deadline);
      return d !== null && d <= 1;
    });
    if (!soon.length) return;
    // the one due first names the reminder
    soon.sort((a, b) => Checklist.daysUntil(a.deadline) - Checklist.daysUntil(b.deadline));
    const first = soon[0];
    const task = first.subject ? `${first.subject}: ${first.text}` : first.text;
    const due = Checklist.daysUntil(first.deadline);
    const key = soon.length > 1 ? 'hw.remindMany' : due < 0 ? 'hw.remindLate' : due === 0 ? 'hw.remindToday' : 'hw.remindTomorrow';
    const body = t(key, { task: task.length > 60 ? task.slice(0, 58) + '…' : task, n: soon.length });
    markSent(String(user.id), slot.id);
    notify(t('hw.title'), body);
  }

  // Asked once, when homework is first added and the choice has never been
  // made. Yes and "not now" weigh the same: the toast simply goes away, and
  // the switch stays in Settings.
  function offerOnce() {
    try {
      if (localStorage.getItem(PREF) !== null || localStorage.getItem(ASKED) === '1') return;
      if (!window.Auth || !Auth.isLoggedIn() || !window.Toast) return;
      const user = Auth.getUser();
      if (!user || (user.role && user.role !== 'student')) return;
      localStorage.setItem(ASKED, '1');
    } catch { return; }
    Toast.show(t('hw.offer'), { action: { label: t('hw.offerYes'), onClick: () => setEnabled(true) }, timeout: 12000 });
  }

  function paint() {
    const sw = document.getElementById('hwRemindOn');
    if (sw) sw.checked = enabled();
  }

  function start() {
    if (timer) return;
    setTimeout(check, 60 * 1000);
    timer = setInterval(check, CHECK_MS);
  }

  function init() {
    const sw = document.getElementById('hwRemindOn');
    if (sw) sw.addEventListener('change', () => setEnabled(sw.checked));
    paint();
    start();
    // back from sleep or another window: look now rather than in five minutes
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    window.addEventListener('climby:tasks-changed', offerOnce);
  }

  document.addEventListener('DOMContentLoaded', init);
  return { check, dueSlot, enabled, setEnabled };
})();

window.HomeworkReminders = HomeworkReminders;
