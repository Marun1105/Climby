// settings.js — акаунт менюто (аватар/име, вход/изход) в долния ляв ъгъл на sidebar-а,
// и модалът с настройки (тема + език), отворен от там. Самите тема/език логики си остават
// в theme.js/i18n.js — тук само местим кой бутон ги отваря.
const AccountUI = (() => {
  const $ = id => document.getElementById(id);

  function isMenuOpen() { return !$('accountMenu').classList.contains('hidden'); }

  function closeMenu() {
    $('accountMenu').classList.add('hidden');
    $('accountBtn').setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (isMenuOpen()) { closeMenu(); return; }
    $('accountMenu').classList.remove('hidden');
    $('accountBtn').setAttribute('aria-expanded', 'true');
  }

  // section: open straight at one part of Settings (Family, Class, ...)
  function openSettings(section) {
    closeMenu();
    document.documentElement.classList.add('settings-open');
    $('settingsOverlay').classList.remove('hidden');
    renderDevices();
    const first = document.querySelector('#settingsOverlay .settings-group:not(.hidden)');
    const target = (typeof section === 'string' && $(section)) || first;
    if (target) showGroup(target);
    window.dispatchEvent(new CustomEvent('climby:settings-opened'));
  }

  // Свързаните телефони. Списъкът се презарежда при всяко отваряне, а не се пази:
  // телефон може да е бил откачен от друго устройство, а тук се идва точно
  // когато нещо трябва да се откачи.
  function renderDevices() {
    const box = $('settingsDevices');
    if (!box) return;
    box.textContent = '';

    if (!window.Auth || !Auth.isLoggedIn()) {
      $('settingsDevicesRow').classList.add('hidden');
      return;
    }
    $('settingsDevicesRow').classList.remove('hidden');

    Promise.resolve(window.Phone ? Phone.refreshDevices() : null).then(() => {
      const devices = window.Phone ? Phone.listPaired() : [];
      box.textContent = '';
      if (!devices.length) {
        box.appendChild(_note(t('settings.devicesEmpty')));
        return;
      }
      devices.forEach(device => box.appendChild(_deviceRow(device)));
      // Какво може свързаният телефон се казва веднъж, под списъка — там, където
      // човекът тъкмо е видял имената. Като празен екран не носи нищо.
      box.appendChild(_note(t('settings.devicesHint')));
    });
  }

  function _note(text) {
    const el = document.createElement('p');
    el.className = 'settings-note';
    el.textContent = text;
    return el;
  }

  function _deviceRow(device) {
    const row = document.createElement('div');
    row.className = 'device-row';

    const left = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'device-name';
    name.textContent = device.name;
    left.appendChild(name);

    if (device.last_seen_at) {
      const meta = document.createElement('div');
      meta.className = 'device-meta';
      meta.textContent = new Date(device.last_seen_at).toLocaleDateString();
      left.appendChild(meta);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-link';
    btn.textContent = t('settings.forget');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      Phone.forget(device.id).then(renderDevices).catch(() => { btn.disabled = false; });
    });

    row.appendChild(left);
    row.appendChild(btn);
    return row;
  }

  function closeSettings() {
    $('settingsOverlay').classList.add('hidden');
    document.documentElement.classList.remove('settings-open');
    window.dispatchEvent(new CustomEvent('climby:settings-closed'));
  }

  // A parent has no class, a teacher no family: the sections, and their
  // links in the list, are hidden for the role they do not apply to.
  function updateSettingsAccess() {
    const role = window.Auth && Auth.isLoggedIn() ? Auth.getRole() : null;
    document.querySelectorAll('[data-settings-role]').forEach(el => {
      const allowed = el.dataset.settingsRole.split(' ');
      el.classList.toggle('hidden', !!role && !allowed.includes(role));
    });
    const shown = document.querySelector('#settingsOverlay .settings-group.is-shown:not(.hidden)');
    const first = document.querySelector('#settingsOverlay .settings-group:not(.hidden)');
    if (!shown && first) showGroup(first);
  }

  function updateAccount() {
    const user = Auth.getUser();
    const avatar = $('accountAvatar');
    const name = $('accountName');

    if (user) {
      const initial = (user.display_name || '?').trim().charAt(0).toUpperCase();
      if (window.ProfilePhoto) ProfilePhoto.paint(avatar, initial || '?');
      else avatar.textContent = initial || '?';
      name.removeAttribute('data-i18n');
      name.textContent = user.display_name;
      if ($('profileName')) $('profileName').textContent = user.display_name || '';
      if ($('profileEmail')) $('profileEmail').textContent = user.email || '';
      if ($('profilePhoto') && window.ProfilePhoto) ProfilePhoto.paint($('profilePhoto'), initial || '?');
    } else {
      avatar.style.backgroundImage = '';
      avatar.classList.remove('has-photo');
      avatar.textContent = '?';
      name.setAttribute('data-i18n', 'account.guest');
      name.textContent = t('account.guest');
    }
    $('menuLoginBtn').classList.toggle('hidden', !!user);
    $('logoutBtn').classList.toggle('hidden', !user);
  }

  // One category at a time. Settings was a single long page with a list
  // beside it that scrolled you to a heading; with a dozen sections that is a
  // lot to move through to find one switch. Now the list chooses and the
  // right-hand side shows only that category. `target` may be a group or
  // something inside one (the memory row): its group is shown, and it is
  // scrolled to.
  function showGroup(target) {
    let group = target.closest('.settings-group') || target;
    if (group.classList.contains('hidden')) {
      group = document.querySelector('#settingsOverlay .settings-group:not(.hidden)') || group;
      target = group;
    }
    document.querySelectorAll('#settingsOverlay .settings-group').forEach(g => {
      g.classList.toggle('is-shown', g === group);
    });
    markNav(group.id);
    const card = document.querySelector('#settingsOverlay .settings-card');
    if (card) card.scrollTop = 0;
    if (target !== group) target.scrollIntoView({ block: 'start' });
  }

  function markNav(id) {
    document.querySelectorAll('[data-settings-jump]').forEach(link => {
      if (link.dataset.settingsJump === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function init() {
    updateAccount();
    window.addEventListener('climby:auth-changed', updateAccount);
    window.addEventListener('climby:lang-changed', updateAccount);
    window.addEventListener('climby:photo-changed', updateAccount);
    window.addEventListener('climby:auth-changed', updateSettingsAccess);
    updateSettingsAccess();
    window.addEventListener('climby:auth-changed', renderDevices);
    // Смяната на езика става В ТОЗИ прозорец. Без този ред единственият текст,
    // който остава на стария език, е точно този под превключвателя.
    window.addEventListener('climby:lang-changed', renderDevices);

    $('accountBtn').addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
    $('settingsMenuBtn').addEventListener('click', () => openSettings());
    $('menuLoginBtn').addEventListener('click', () => { closeMenu(); Auth.openEntryGate(); });

    // The section list on the left chooses which category the right side shows.
    document.querySelectorAll('[data-settings-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.settingsJump);
        if (target) showGroup(target);
      });
    });

    $('settingsClose').addEventListener('click', closeSettings);
    $('settingsOverlay').addEventListener('click', e => {
      if (e.target === $('settingsOverlay')) closeSettings();
    });

    document.addEventListener('click', e => {
      if (isMenuOpen() && !e.target.closest('.sidebar-account')) closeMenu();
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (!$('settingsOverlay').classList.contains('hidden')) closeSettings();
      else if (isMenuOpen()) closeMenu();
    });
  }

  return { init, open: openSettings, close: closeSettings };
})();
window.AccountUI = AccountUI;

// The version and the update check, only where there is a desktop to ask.
// In a browser the row stays hidden: there is nothing to update.
(function aboutRow() {
  const bridge = window.CLIMBY_DESKTOP;
  const row = document.getElementById('settingsAboutRow');
  if (!row || !bridge || typeof bridge.version !== 'function') return;
  const button = document.getElementById('settingsUpdateBtn');
  const status = document.getElementById('settingsUpdateStatus');
  let statusKey = '';
  let statusVersion = null;
  function renderUpdateStatus() {
    status.textContent = statusKey ? t(statusKey, statusVersion ? { version: statusVersion } : {}) : '';
  }
  function receiveUpdateStatus(result) {
    const keys = {
      checking: 'settings.updateChecking',
      current: 'settings.updateCurrent',
      downloading: 'settings.updateDownloading',
      ready: 'settings.updateReady',
      error: 'settings.updateError',
      development: 'settings.updateDevelopment',
      store: 'settings.updateStore',
      portable: 'settings.updatePortable',
      busy: 'settings.updateBusy',
    };
    if (!result || !keys[result.status]) return;
    statusKey = keys[result.status];
    statusVersion = result.version || null;
    button.disabled = result.status === 'checking';
    renderUpdateStatus();
  }
  row.classList.remove('hidden');
  bridge.version().then(v => { document.getElementById('settingsVersion').textContent = v; }).catch(() => {});
  if (typeof bridge.onUpdateStatus === 'function') bridge.onUpdateStatus(receiveUpdateStatus);
  window.addEventListener('climby:lang-changed', renderUpdateStatus);
  button.addEventListener('click', () => {
    button.disabled = true;
    receiveUpdateStatus({ status: 'checking' });
    bridge.checkForUpdates().then(result => {
      if (result && result !== 'checking') receiveUpdateStatus({ status: result });
    }).catch(() => receiveUpdateStatus({ status: 'error' }));
  });
})();

document.addEventListener('DOMContentLoaded', AccountUI.init);
