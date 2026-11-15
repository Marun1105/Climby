// auth.js — регистрация, вход, потвърждение на имейл, изход. Пази сесията в local/sessionStorage.
const Auth = (() => {
  const $ = id => document.getElementById(id);
  const BACKEND = window.CLIMBY_BACKEND;
  const TOKEN_KEY = 'climby-token';
  const USER_KEY = 'climby-user';
  const GUEST_KEY = 'climby-guest-skip';

  // "Remember me" checked -> localStorage (survives browser restarts).
  // Unchecked -> sessionStorage (cleared when the browser/tab closes).
  function getToken() { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY); }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try { return JSON.parse(raw); }
    catch { return null; }
  }

  function isLoggedIn() { return !!getToken(); }

  function _setSession(token, user, remember) {
    try { localStorage.setItem(KNOWN_KEY, '1'); } catch { /* the welcome shows again; harmless */ }
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('climby:auth-changed', { detail: { loggedIn: true, user } }));
  }

  // showGate: true for an explicit "Log out" click (bring back the entry gate);
  // false for a silent session-expiry logout (401), which shouldn't interrupt whatever else is on screen.
  function logout(showGate) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    if (showGate) localStorage.removeItem(GUEST_KEY);
    window.dispatchEvent(new CustomEvent('climby:auth-changed', { detail: { loggedIn: false, showGate: !!showGate } }));
    if (showGate) showEntryGate();
  }

  // ---------- entry gate (full-screen login/register shown before the app) ----------

  // Someone who has signed in on this computer before knows what Climby is:
  // they get the sign-in form. Everyone else gets the welcome first.
  const KNOWN_KEY = 'climby-known';
  function isKnown() { try { return localStorage.getItem(KNOWN_KEY) === '1'; } catch { return false; } }

  function showEntryGate() { $('entryGate').classList.remove('hidden'); }

  function hideEntryGate() {
    const wasOpen = !$('entryGate').classList.contains('hidden');
    $('entryGate').classList.add('hidden');
    // въведението чака бариерата да се махне, за да не се застъпват двата слоя
    if (wasOpen) window.dispatchEvent(new CustomEvent('climby:entry-gate-closed'));
  }

  function updateEntryGateVisibility() {
    if (isLoggedIn() || localStorage.getItem(GUEST_KEY) === '1') hideEntryGate();
    else showEntryGate();
  }

  function skipEntryGate() {
    localStorage.setItem(GUEST_KEY, '1');
    hideEntryGate();
  }

  async function _post(path, body) {
    let res;
    try {
      res = await Net.fetch(BACKEND + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(t('auth.errOffline'));
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(_errorMessage(data.detail));
    return data;
  }

  function _errorMessage(detail) {
    if (typeof detail === 'string' && detail) return detail;
    if (Array.isArray(detail) && detail.length) return detail.map(d => d.msg).join(' ');
    return t('auth.errGeneric');
  }

  async function register(displayName, email, password, role, username, phone, heardFrom) {
    // Празните полета се пращат като null, а не като "" — сървърът приема липса,
    // но празен низ би минал за избрано име и би се блъснал в уникалността.
    return _post('/auth/register', {
      display_name: displayName, email, password, role,
      username: username || null,
      phone: phone || null,
      heard_from: heardFrom || null,
      accept_terms: true,           // handleRegister stops before here unless it is ticked
    });
  }

  function getRole() {
    const user = getUser();
    return (user && user.role) || 'student';
  }

  async function verifyEmail(email, code) {
    return _post('/auth/verify-email', { email, code });
  }

  async function verifyRegistrationPhone(email, code) {
    const data = await _post('/auth/verify-registration-phone', { email, code });
    _setSession(data.token, data.user, true);
    return data;
  }

  async function resendRegistrationPhone(email) {
    return _post('/auth/resend-registration-phone', { email });
  }

  async function resendCode(email) {
    return _post('/auth/resend-code', { email });
  }

  async function login(identifier, password, remember) {
    const data = await _post('/auth/login', { identifier, password });
    _setSession(data.token, data.user, remember);
    return data;
  }

  async function forgotPassword(email) {
    return _post('/auth/forgot-password', { channel: 'email', contact: email });
  }

  async function resetPassword(email, code, newPassword) {
    return _post('/auth/reset-password', { channel: 'email', contact: email, code, new_password: newPassword });
  }

  // ---------- UI ----------

  let pendingVerifyEmail = null;
  let pendingPhoneEmail = null;
  let pendingResetEmail = null;

  function showForm(name) {
    // 'role' belongs here even though nothing calls showForm('role'): without it
    // the role screen is only ever closed by answering it, so dismissing the gate
    // and coming back leaves three role buttons stacked under the login form.
    ['login', 'register', 'verify', 'verifyPhone', 'forgot', 'reset', 'role'].forEach(f => {
      const el = $(`${f}Form`);
      if (el) el.classList.toggle('hidden', f !== name);
    });
    // The welcome is its own screen, not a form inside the card.
    const welcome = name === 'welcome';
    $('welcomePanel').classList.toggle('hidden', !welcome);
    $('entryGateCard').classList.toggle('hidden', welcome);
    if (welcome && window.Welcome) Welcome.reveal();
    // Sign-up is kept short: the "why" box and the long security note belong
    // to the sign-in form. Sign-up has its own one-line promise by the checkbox.
    $('authIntro').classList.toggle('hidden', name !== 'login');
    $('authSecurityNote').classList.toggle('hidden', name !== 'login');
    clearError();
  }

  // kind 'error' (red, something went wrong) vs 'success' (green, informational — code sent, password changed)
  function setError(msg, kind) {
    const el = $('authError');
    el.textContent = msg;
    el.classList.remove('hidden');
    el.classList.toggle('is-error', kind !== 'success');
    el.classList.toggle('is-success', kind === 'success');
  }

  function setNotice(msg) {
    setError(msg, 'success');
  }

  function clearError() {
    $('authError').classList.add('hidden');
  }

  // Заявката към сървъра може да отнеме близо минута, ако Render е заспал (виж net.js).
  // Без видим знак бутонът изглежда счупен: натискаш и не се случва нищо, натискаш пак
  // и тръгват няколко влизания едновременно. Затова бутонът се заключва и го казва.
  async function _withBusy(btn, fn) {
    if (btn.disabled) return;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = t('auth.busy');
    try {
      await fn();
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  // These are real <form>s so that password managers offer to save and fill
  // them, and Enter reaches the primary button natively. The one thing a real
  // form must not do here is navigate: the button's click handler does the work.
  function _submitOnEnter(formId, btnId) {
    $(formId).addEventListener('submit', e => e.preventDefault());
  }

  // ---------- password strength meter (register + reset) ----------

  const PW_MIN = 8;   // the same minimum the server enforces

  // The ten thousand passwords everyone already knows (common-passwords.txt,
  // built by tools/build_common_passwords.py from a published list). Fetched
  // the first time a new password is being typed; the server checks the same
  // list, so this only makes the answer arrive while typing.
  let commonPasswords = null;
  let commonLoading = null;
  function loadCommonPasswords() {
    if (commonPasswords || commonLoading) return;
    commonLoading = fetch('common-passwords.txt')
      .then(r => (r.ok ? r.text() : ''))
      .then(text => {
        commonPasswords = new Set(text.split('\n').filter(Boolean));
        // whatever is already typed is judged again now that the list is here
        updatePwStrength('registerPassword', 'registerPwStrength', 'registerPwBar', 'registerPwLabel');
        updatePwStrength('resetPassword', 'resetPwStrength', 'resetPwBar', 'resetPwLabel');
      })
      .catch(() => { commonLoading = null; });
  }
  function isCommonPassword(pw) {
    return !!(commonPasswords && commonPasswords.has(String(pw).trim().toLowerCase()));
  }

  // ---------- username: free or taken, said while typing ----------
  //
  // The check waits until typing pauses (a request per keystroke would be
  // noise, and "taken" flashing under a half-typed name is wrong more often
  // than right). A newer keystroke makes an older answer irrelevant.
  const USERNAME_SHAPE = /^[a-zA-Z0-9_.]{3,20}$/;
  let usernameTimer = null;
  let usernameSeq = 0;
  let usernameState = 'unknown';     // unknown | ok | taken | invalid

  function usernameStatus(kind, text, ideas) {
    const el = $('registerUsernameStatus');
    el.className = 'field-status' + (kind ? ' is-' + kind : ' hidden');
    el.textContent = text || '';
    for (const idea of ideas || []) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'field-chip';
      chip.textContent = idea;
      chip.addEventListener('click', () => {
        $('registerUsername').value = idea;
        usernameState = 'ok';            // the server just said these are free
        usernameStatus('ok', t('auth.usernameFree'));
        $('registerEmail').value ? $('registerPassword').focus() : $('registerEmail').focus();
      });
      el.appendChild(chip);
    }
  }

  async function askUsername(name, forIdeas) {
    const mine = ++usernameSeq;
    try {
      const res = await fetch(BACKEND + '/auth/username-check?username=' + encodeURIComponent(name));
      if (!res.ok || mine !== usernameSeq) return null;
      return await res.json();
    } catch {
      return null;      // no answer is not "taken": the form still submits and the server decides
    }
  }

  function checkUsernameSoon() {
    clearTimeout(usernameTimer);
    usernameSeq++;
    usernameState = 'unknown';
    const name = $('registerUsername').value.trim();
    if (!name) { usernameStatus(null); return; }
    if (!USERNAME_SHAPE.test(name)) {
      // the rule is only said once they have typed enough to have broken it
      if (name.length >= 3 || /[^a-zA-Z0-9_.]/.test(name)) { usernameState = 'invalid'; usernameStatus('bad', t('auth.usernameRule')); }
      else usernameStatus(null);
      return;
    }
    usernameStatus('wait', t('auth.usernameChecking'));
    usernameTimer = setTimeout(async () => {
      const data = await askUsername(name);
      if (!data || $('registerUsername').value.trim() !== name) { if (!data) usernameStatus(null); return; }
      if (data.ok) { usernameState = 'ok'; usernameStatus('ok', t('auth.usernameFree')); }
      else { usernameState = 'taken'; usernameStatus('bad', t('auth.usernameTaken'), data.suggestions); }
    }, 450);
  }

  // No username yet and an email just typed: offer one made from the address.
  async function suggestUsernameFromEmail() {
    if ($('registerUsername').value.trim()) return;
    const local = ($('registerEmail').value.split('@')[0] || '').replace(/[^a-zA-Z0-9_.]/g, '');
    if (local.length < 3) return;
    const data = await askUsername(local);
    if (!data || $('registerUsername').value.trim()) return;
    const ideas = data.ok ? [local.toLowerCase()] : data.suggestions;
    if (ideas && ideas.length) usernameStatus('hint', t('auth.usernameSuggest'), ideas);
  }

  function pwScore(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  }

  function updatePwStrength(inputId, wrapId, barId, labelId) {
    const pw = $(inputId).value;
    const wrap = $(wrapId);
    if (!pw) { wrap.classList.add('hidden'); return; }
    wrap.classList.remove('hidden');
    const score = pwScore(pw);
    const bar = $(barId);
    const label = $(labelId);
    const pct = pw.length < PW_MIN ? Math.max(8, (pw.length / PW_MIN) * 33) : isCommonPassword(pw) ? 33 : score <= 2 ? 66 : 100;
    bar.style.width = pct + '%';
    // Силата се показваше с цвят — а в черно-бяла тема --danger, --warn, --blue
    // и --accent са едно и също бяло. Тоест "слаба" се рисуваше най-ярко от
    // всички, точно обратното на смисъла. Затова степента вече е клас, а
    // плътността расте заедно с нея (виж .pw-strength-fill в style.css).
    // Three states, each with its own colour AND its own words, so it reads
    // without colour too: red — does not meet the requirement (8 characters);
    // yellow — accepted, but easy to guess; green — good.
    let level, text;
    if (pw.length < PW_MIN) { level = 'is-bad'; text = t('auth.pwTooShort', { n: PW_MIN }); }
    else if (isCommonPassword(pw)) { level = 'is-bad'; text = t('auth.pwCommon'); }
    else if (score <= 2) { level = 'is-ok'; text = t('auth.pwFair'); }
    else { level = 'is-strong'; text = t('auth.pwStrong'); }
    bar.className = 'pw-strength-fill ' + level;
    label.className = 'pw-strength-label ' + level;
    label.textContent = text;
  }

  async function handleRegister() {
    clearError();
    // Sign-up asks for four things. The name people see starts as the
    // username; "who are you" and the rest are asked after the first sign-in
    // (onboarding.js), where they can be skipped.
    const username = $('registerUsername').value.trim();
    const email = $('registerEmail').value.trim();
    const password = $('registerPassword').value;
    const phone = $('registerPhone').value.trim();
    if (!username || !email || !password) {
      setError(t('auth.errFillAll'));
      return;
    }
    if (!USERNAME_SHAPE.test(username)) {
      setError(t('auth.usernameRule'));
      return;
    }
    if (usernameState === 'taken') {
      setError(t('auth.usernameTaken'));
      $('registerUsername').focus();
      return;
    }
    if (password.length < PW_MIN) {
      setError(t('auth.pwTooShort', { n: PW_MIN }));
      return;
    }
    if (isCommonPassword(password)) {
      setError(t('auth.pwCommon'));
      return;
    }
    if (!$('registerTerms').checked) {
      setError(t('auth.termsNeeded'));
      return;
    }
    try {
      // Отговорът "откъде чу за нас" е даден още във въпросника при първото
      // отваряне — пътува с регистрацията, вместо да се пита пак.
      await register(username, email, password, 'student', username, phone, null);
      pendingVerifyEmail = email;
      showForm('verify');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin() {
    clearError();
    const identifier = $('loginEmail').value.trim();
    const password = $('loginPassword').value;
    if (!identifier || !password) {
      setError(t('auth.errFillLogin'));
      return;
    }
    try {
      await login(identifier, password, $('loginRemember').checked);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVerify() {
    clearError();
    const code = $('verifyCode').value.trim();
    if (!code || !pendingVerifyEmail) {
      setError(t('auth.errEnterCode'));
      return;
    }
    try {
      const result = await verifyEmail(pendingVerifyEmail, code);
      if (result.status === 'phone_verification_required') {
        pendingPhoneEmail = pendingVerifyEmail;
        showForm('verifyPhone');
        setNotice(t(result.sms_sent ? 'auth.phoneCodeSent' : 'auth.phoneCodeUnavailable'));
      } else {
        _setSession(result.token, result.user, true);
        pendingVerifyEmail = null;
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVerifyPhone() {
    clearError();
    const code = $('verifyPhoneCode').value.trim();
    if (!code || !pendingPhoneEmail) {
      setError(t('auth.errEnterCode'));
      return;
    }
    try {
      await verifyRegistrationPhone(pendingPhoneEmail, code);
      pendingVerifyEmail = null;
      pendingPhoneEmail = null;
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResendPhoneCode() {
    if (!pendingPhoneEmail) return;
    clearError();
    try {
      const result = await resendRegistrationPhone(pendingPhoneEmail);
      setNotice(t(result.sms_sent ? 'auth.phoneCodeSent' : 'auth.phoneCodeUnavailable'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResend() {
    if (!pendingVerifyEmail) return;
    clearError();
    try {
      await resendCode(pendingVerifyEmail);
      setNotice(t('auth.newCodeSent'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleForgot() {
    clearError();
    const email = $('forgotEmail').value.trim();
    if (!email) {
      setError(t('auth.errEnterEmail'));
      return;
    }
    try {
      await forgotPassword(email);
      pendingResetEmail = email;
      showForm('reset');
      setNotice(t('auth.resetCodeSentMaybe'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReset() {
    clearError();
    const code = $('resetCode').value.trim();
    const password = $('resetPassword').value;
    if (!pendingResetEmail || !code || !password) {
      setError(t('auth.errFillReset'));
      return;
    }
    try {
      await resetPassword(pendingResetEmail, code, password);
      pendingResetEmail = null;
      $('loginEmail').value = '';
      showForm('login');
      setNotice(t('auth.passwordChanged'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResendReset() {
    if (!pendingResetEmail) return;
    clearError();
    try {
      await forgotPassword(pendingResetEmail);
      setNotice(t('auth.resetCodeSent'));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    logout(true);
  }

  function resetFormsOnLogout(e) {
    // Only touch the entry gate on a real login or an explicit "Log out" click —
    // a silent session-expiry logout (401) must not interrupt whatever's on screen.
    if (e.detail.loggedIn || e.detail.showGate) updateEntryGateVisibility();
    if (e.detail.loggedIn) return;
    ['loginForm', 'registerForm', 'verifyForm', 'verifyPhoneForm', 'forgotForm', 'resetForm'].forEach(id => {
      $(id).querySelectorAll('input:not([type="radio"]):not([type="checkbox"])').forEach(i => { i.value = ''; });
    });
    $('loginRemember').checked = false;
    $('registerPwStrength').classList.add('hidden');
    $('resetPwStrength').classList.add('hidden');
    usernameState = 'unknown';
    usernameStatus(null);
    pendingVerifyEmail = null;
    pendingPhoneEmail = null;
    pendingResetEmail = null;
    showForm('login');
  }

  function init() {
    if ($('googleSignIn')) $('googleSignIn').addEventListener('click', startGoogle);
    revealGoogleIfAvailable();
    document.querySelectorAll('.role-choice').forEach(btn => {
      btn.addEventListener('click', () => chooseRole(btn.dataset.role));
    });
    if (window.CLIMBY_DESKTOP && window.CLIMBY_DESKTOP.onSignIn) {
      window.CLIMBY_DESKTOP.onSignIn(receiveDesktopSignIn);
    }
    updateEntryGateVisibility();
    window.addEventListener('climby:auth-changed', resetFormsOnLogout);

    $('entryGateClose').addEventListener('click', skipEntryGate);
    $('checklistLoginBtn').addEventListener('click', showEntryGate);

    $('showRegister').addEventListener('click', e => { e.preventDefault(); showForm('register'); loadCommonPasswords(); });
    $('showLogin').addEventListener('click', e => { e.preventDefault(); showForm('login'); });
    $('showForgot').addEventListener('click', e => { e.preventDefault(); showForm('forgot'); });
    $('showLoginFromForgot').addEventListener('click', e => { e.preventDefault(); showForm('login'); });
    $('resendCodeLink').addEventListener('click', e => { e.preventDefault(); handleResend(); });
    $('resendPhoneCodeLink').addEventListener('click', e => { e.preventDefault(); handleResendPhoneCode(); });
    $('resendResetLink').addEventListener('click', e => { e.preventDefault(); handleResendReset(); });

    $('loginBtn').addEventListener('click', () => _withBusy($('loginBtn'), handleLogin));
    $('registerBtn').addEventListener('click', () => _withBusy($('registerBtn'), handleRegister));
    $('verifyBtn').addEventListener('click', () => _withBusy($('verifyBtn'), handleVerify));
    $('verifyPhoneBtn').addEventListener('click', () => _withBusy($('verifyPhoneBtn'), handleVerifyPhone));
    $('forgotBtn').addEventListener('click', () => _withBusy($('forgotBtn'), handleForgot));
    $('resetBtn').addEventListener('click', () => _withBusy($('resetBtn'), handleReset));
    $('logoutBtn').addEventListener('click', handleLogout);

    $('welcomeStart').addEventListener('click', () => { showForm('register'); loadCommonPasswords(); $('registerUsername').focus(); });
    $('welcomeLogin').addEventListener('click', e => { e.preventDefault(); showForm('login'); $('loginEmail').focus(); });
    $('welcomeGuest').addEventListener('click', skipEntryGate);
    showForm(isKnown() ? 'login' : 'welcome');

    _submitOnEnter('loginForm', 'loginBtn');
    _submitOnEnter('registerForm', 'registerBtn');
    _submitOnEnter('verifyForm', 'verifyBtn');
    _submitOnEnter('verifyPhoneForm', 'verifyPhoneBtn');
    _submitOnEnter('forgotForm', 'forgotBtn');
    _submitOnEnter('resetForm', 'resetBtn');

    $('registerUsername').addEventListener('input', checkUsernameSoon);
    $('registerEmail').addEventListener('blur', suggestUsernameFromEmail);
    $('registerPassword').addEventListener('focus', loadCommonPasswords);
    $('resetPassword').addEventListener('focus', loadCommonPasswords);
    $('registerPassword').addEventListener('input', () =>
      updatePwStrength('registerPassword', 'registerPwStrength', 'registerPwBar', 'registerPwLabel'));
    $('resetPassword').addEventListener('input', () =>
      updatePwStrength('resetPassword', 'resetPwStrength', 'resetPwBar', 'resetPwLabel'));
  }

  // --- Google ---------------------------------------------------------------
  //
  // The browser leg has to happen in the REAL browser: Google refuses to run its
  // consent screen inside an embedded webview, so an in-app window would only
  // ever show an error.
  const NONCE_KEY = 'climby-oauth-nonce';

  // The button stays hidden until the server says the flow exists here. It is a
  // cheap request and it fails closed: no answer, no button, and the password
  // form — which always works — is untouched either way.
  function revealGoogleIfAvailable() {
    const block = $('googleBlock');
    if (!block) return;
    // Only the desktop shell can catch climby://auth. In a browser the tab would
    // reach the end of the flow and stop there, with the token undeliverable —
    // a button that looks like it works and does not.
    if (!(window.CLIMBY_DESKTOP && window.CLIMBY_DESKTOP.onSignIn)) return;
    fetch(BACKEND + '/auth/providers')
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(info => { if (info && info.google) block.classList.remove('hidden'); })
      .catch(() => { /* asleep or unreachable: leave it hidden */ });
  }

  function startGoogle() {
    // A value only this copy of Climby knows. It travels to the server and comes
    // back in the climby:// link, and a link that does not carry it is ignored
    // below — otherwise a link someone mails you signs your app into their
    // account, and everything you write afterwards lands in their profile.
    // crypto.getRandomValues, not Math.random: this is a security token, and
    // Math.random's next output can be derived from its previous ones. 128 bits,
    // hex — which also keeps it inside the character set the server accepts.
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const nonce = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    try { sessionStorage.setItem(NONCE_KEY, nonce); } catch { /* private mode: the check below fails closed */ }
    window.open(BACKEND + '/auth/google/start?app=' + encodeURIComponent(nonce), '_blank');
  }

  // The desktop shell catches climby://auth and hands the payload here.
  function receiveDesktopSignIn(payload) {
    if (!payload || !payload.token) return;
    let expected = null;
    try { expected = sessionStorage.getItem(NONCE_KEY); } catch { /* nothing remembered */ }
    if (!expected || payload.nonce !== expected) {
      // We never asked for this sign-in. Say nothing and change nothing.
      return;
    }
    try { sessionStorage.removeItem(NONCE_KEY); } catch { /* it was one-use anyway */ }

    fetch(BACKEND + '/auth/me', { headers: { Authorization: 'Bearer ' + payload.token } })
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(user => {
        _setSession(payload.token, user, true);
        if (payload.isNew) showRoleChoice();
        else hideEntryGate();
      })
      .catch(() => setError(window.t ? t('auth.googleFailed') : 'Google sign-in did not work.'));
  }

  function showRoleChoice() {
    ['loginForm', 'registerForm', 'verifyForm'].forEach(id => {
      if ($(id)) $(id).classList.add('hidden');
    });
    if ($('roleForm')) $('roleForm').classList.remove('hidden');
    // the role question lives in the card, which the welcome screen hides
    $('welcomePanel').classList.add('hidden');
    $('entryGateCard').classList.remove('hidden');
    // The gate has to be re-opened, not merely left alone. _setSession fires
    // climby:auth-changed, whose listener sees a signed-in user and closes the
    // gate — and #roleForm lives inside it. Without this line the question is
    // asked into a hidden overlay and every Google account silently stays a
    // student, which is the one thing this screen exists to prevent.
    showEntryGate();
  }

  function chooseRole(role) {
    // The one question a Google sign-up hasn't answered yet. Asked here, not
    // after: the server refuses the role without it.
    if ($('roleTerms') && !$('roleTerms').checked) {
      $('roleTermsError').classList.remove('hidden');
      return;
    }
    if ($('roleTermsError')) $('roleTermsError').classList.add('hidden');
    // The answer is remembered locally whatever the server says: the person is
    // already signed in, and a failed request here must not trap them on this
    // screen. A wrong role is fixable in Settings; a dead end is not.
    fetch(BACKEND + '/auth/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ role, accept_terms: true }),
    }).finally(() => {
      // If the session ended while this was in flight (an expired token
      // elsewhere logs out silently), writing the cached user back would leave a
      // user record with no token — getUser() answering while isLoggedIn() says
      // no. Better to leave nothing behind; the server holds the real role.
      if (!getToken()) return;
      const user = getUser() || {};
      user.role = role;
      const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      store.setItem(USER_KEY, JSON.stringify(user));
      if ($('roleForm')) $('roleForm').classList.add('hidden');
      // answered here already: the questions after sign-in start from the next one
      try { sessionStorage.setItem('climby-role-asked', '1'); } catch { /* asked twice, at worst */ }
      hideEntryGate();
      window.dispatchEvent(new CustomEvent('climby:auth-changed', { detail: { loggedIn: true, user } }));
    });
  }

  // After a password change the server hands back a fresh token; every other
  // session is over. Keep the same storage as before (remembered or not).
  // remember: pass it when the stored token may already be gone (a 401 in
  // between clears it), otherwise it is read from where the token is now.
  function replaceSession(token, user, remember) {
    _setSession(token, user, typeof remember === 'boolean' ? remember : !!localStorage.getItem(TOKEN_KEY));
  }

  // The profile changed (grade, town); the stored user should say so too,
  // without a new token and without re-announcing a sign-in.
  function updateUser(user) {
    const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    store.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('climby:user-updated', { detail: { user } }));
  }

  return { getToken, getUser, getRole, isLoggedIn, logout, init, openEntryGate: showEntryGate, replaceSession, updateUser };
})();

// Модулите се пишат като `const X = (() => {...})()`, а `const` на най-горно ниво
// НЕ става свойство на window — попада в лексикалната среда на скрипта. Затова
// проверки от вида `window.Auth && ...` в други файлове мълчаливо виждаха
// "няма Auth" и се отказваха: фокус сесиите не се записваха на никого, а менюто
// не скриваше чуждите роли. Затова връзката се прави тук изрично.
window.Auth = Auth;

document.addEventListener('DOMContentLoaded', Auth.init);
