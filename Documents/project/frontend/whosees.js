// whosees.js — Settings → "Who can see what".
//
// The rules about who sees what were true but scattered: a line under Family,
// a line on the Focus screen, two switches on a card in Friends. A student
// should not have to collect them. This section says it once, and shows the
// live state of the two things a student can switch: whether friends see
// "studying now", and whether they see points and days in a row.
const WhoSees = (() => {
  const $ = id => document.getElementById(id);
  const BACKEND = window.CLIMBY_BACKEND;
  const t = (k, v) => (window.t ? window.t(k, v) : k);

  function put(el, on) {
    el.textContent = on === null ? t('whosees.notSet') : t(on ? 'whosees.on' : 'whosees.off');
  }

  async function refresh() {
    const live = $('whoseesLive'), points = $('whoseesPoints');
    if (!live || !points) return;
    if (!window.Auth || !Auth.isLoggedIn()) { put(live, null); put(points, null); return; }
    try {
      const res = await Net.fetch(BACKEND + '/crew', { headers: { Authorization: `Bearer ${Auth.getToken()}` } });
      const data = res.ok ? await res.json() : null;
      // "needs" means Friends is not set up: nothing is shared with anyone.
      if (!data || data.needs || !data.me) { put(live, null); put(points, null); return; }
      put(live, !!data.me.share_live);
      put(points, !!data.me.share_points);
    } catch {
      put(live, null); put(points, null);
    }
  }

  function init() {
    window.addEventListener('climby:settings-opened', refresh);
    window.addEventListener('climby:lang-changed', refresh);
    const btn = $('whoseesFriendsBtn');
    if (btn) btn.addEventListener('click', () => {
      if (window.AccountUI) AccountUI.close();
      if (window.Nav) Nav.activate('crew');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  return { refresh };
})();

window.WhoSees = WhoSees;
