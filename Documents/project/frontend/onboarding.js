// onboarding.js — a few questions, once, right after the first sign-in.
//
// Sign-up asks only what an account needs (username, email, phone, password).
// Everything else is asked here, one question at a time, over a blurred app:
//
//   who are you        student / parent / teacher
//   grade and school   students only, on one screen
//   country and city   two compact menus
//   where from         how they heard of Climby
//   "You're all set!"
//
// Every question can be skipped; Escape skips them all. Answers are saved to
// the account when the last question is passed. Guests are not asked anything
// — there is no account to keep the answers in. When it closes, tour.js walks
// the real interface.
const Onboarding = (() => {
  const $ = id => document.getElementById(id);
  const BACKEND = window.CLIMBY_BACKEND;
  const DONE_KEY = 'climby-onboarded:';     // + account id

  // Drawn icons, not emoji: emoji arrive coloured by the operating system in an
  // interface that is deliberately quiet, and look different on every machine.
  const ICON_PATHS = {
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.2 8.8-2 5.4-5.4 2 2-5.4z"/>',
    hello: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.3 2.6 2.6 5-5.2"/>',
  };

  function iconSvg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + (ICON_PATHS[name] || '') + '</svg>';
  }

  // Countries and towns come from frontend/places.json, which
  // tools/build_places.py generates from open data (ISO country names in both
  // languages; GeoNames for the towns — every Bulgarian town and village, and
  // elsewhere every place of 15,000 people or more). Nothing is typed by hand.
  // It is half a megabyte, so it is fetched only when these questions open.
  let places = null;
  let placesLoading = null;
  function loadPlaces() {
    if (places) return Promise.resolve(places);
    if (!placesLoading) {
      placesLoading = fetch('places.json')
        .then(r => { if (!r.ok) throw new Error('places ' + r.status); return r.json(); })
        .then(d => { places = d; return d; })
        .catch(() => { placesLoading = null; return null; });   // the fields still take typed text
    }
    return placesLoading;
  }

  const HEARD = [
    ['friend', 'quiz.friend'], ['teacher', 'quiz.fromTeacher'], ['parent', 'quiz.fromParent'],
    ['school', 'quiz.school'], ['social', 'quiz.social'], ['search', 'quiz.search'], ['other', 'quiz.other'],
  ];

  let steps = [];
  let index = 0;
  let open = false;
  let saved = false;
  let answers = {};          // what goes to PATCH /account/profile
  let role = 'student';

  const bg = () => !!(window.I18n && I18n.get() === 'bg');
  const user = () => (window.Auth && Auth.getUser()) || null;

  function stepsFor() {
    // A Google sign-up has just answered this on the sign-in screen.
    let asked = false;
    try { asked = sessionStorage.getItem('climby-role-asked') === '1'; } catch { /* ask */ }
    const list = asked ? [] : ['role'];
    if (role === 'student') list.push('school');
    list.push('place', 'heard', 'done');
    return list;
  }

  // ---- drawing ------------------------------------------------------------

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function choiceButtons(box, options, current, onPick) {
    for (const [value, key] of options) {
      const b = el('button', 'onboarding-choice' + (value === current ? ' is-picked' : ''), t(key));
      b.type = 'button';
      b.addEventListener('click', () => onPick(value));
      box.appendChild(b);
    }
  }

  function textField(label, value, placeholder, max) {
    const wrap = el('label', 'onboarding-field');
    wrap.appendChild(el('span', 'onboarding-label', label));
    const i = el('input', 'onboarding-input');
    i.type = 'text'; i.maxLength = max; i.value = value || ''; i.placeholder = placeholder || '';
    wrap.appendChild(i);
    wrap.control = i;
    return wrap;
  }

  // A menu you can type into. With 250 countries and thousands of towns a
  // plain menu means scrolling; typing two letters is faster and is what form
  // research recommends for long lists. Options are {value, label, also}:
  // `also` is the same place in the other language, so "Sofia" finds София.
  // free: text that matches nothing is still an answer (a village not listed).
  const norm = s => String(s || '').toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const SHOWN = 40;

  function combo(label, { free, onChange }) {
    const wrap = el('div', 'onboarding-field onboarding-combo');
    const title = el('label', 'onboarding-label', label);
    const input = el('input', 'onboarding-input');
    const list = el('ul', 'onboarding-options hidden');
    input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    list.setAttribute('role', 'listbox');
    input.placeholder = t('onb.search');
    wrap.append(title, input, list);

    let options = [];
    let picked = null;       // the chosen option's value
    let active = -1;
    let shown = [];

    const close = () => { list.classList.add('hidden'); input.setAttribute('aria-expanded', 'false'); active = -1; };
    const choose = o => {
      picked = o.value;
      input.value = o.label;
      close();
      if (onChange) onChange(picked);
    };
    const paint = () => {
      [...list.children].forEach((li, i) => {
        li.classList.toggle('is-active', i === active);
        li.setAttribute('aria-selected', i === active ? 'true' : 'false');
        if (i === active) li.scrollIntoView({ block: 'nearest' });
      });
    };
    const draw = () => {
      const q = norm(input.value.trim());
      const starts = [], inside = [];
      for (const o of options) {
        if (!q) { starts.push(o); if (starts.length >= SHOWN) break; continue; }
        const at = Math.min(...[o.key, o.alsoKey].map(k => { const i = k.indexOf(q); return i < 0 ? Infinity : i; }));
        if (at === 0) starts.push(o); else if (at !== Infinity) inside.push(o);
        if (starts.length >= SHOWN) break;
      }
      shown = starts.concat(inside).slice(0, SHOWN);
      list.innerHTML = '';
      for (const o of shown) {
        const li = el('li', 'onboarding-option', o.label);
        li.setAttribute('role', 'option');
        // mousedown, not click: the input's blur would close the list first
        li.addEventListener('mousedown', e => { e.preventDefault(); choose(o); });
        list.appendChild(li);
      }
      if (!shown.length) {
        const none = el('li', 'onboarding-option is-none', t(free ? 'onb.notListed' : 'onb.noMatch'));
        list.appendChild(none);
      }
      active = -1;
      list.classList.remove('hidden');
      input.setAttribute('aria-expanded', 'true');
    };

    input.addEventListener('focus', draw);
    input.addEventListener('input', () => {
      const had = picked;
      picked = null;
      draw();
      if (had !== null && onChange) onChange(null);
    });
    input.addEventListener('blur', () => {
      // typed the whole name instead of picking it: that counts
      if (picked === null) {
        const q = norm(input.value.trim());
        const exact = q && options.find(o => o.key === q || o.alsoKey === q);
        if (exact) choose(exact);
      }
      close();
    });
    input.addEventListener('keydown', e => {
      const open = !list.classList.contains('hidden');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) { draw(); return; }
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % (shown.length || 1);
        paint();
      } else if (e.key === 'Enter' && open && shown.length) {
        e.preventDefault();
        choose(shown[active >= 0 ? active : 0]);
      } else if (e.key === 'Escape' && open) {
        // closes the list only — not the whole set of questions
        e.preventDefault(); e.stopPropagation();
        close();
      }
    });

    wrap.control = input;
    wrap.setOptions = (opts, current) => {
      options = opts.map(o => ({ ...o, key: norm(o.label), alsoKey: norm(o.also || o.value) }));
      const found = current && options.find(o => o.value === current);
      picked = found ? found.value : null;
      input.value = found ? found.label : (free && current ? current : '');
    };
    // what was chosen — or, where free text is allowed, what was typed
    wrap.answer = () => picked !== null ? picked : (free ? input.value.trim() : '');
    return wrap;
  }

  function drawSchool(box) {
    const q = el('div', 'onboarding-field');
    q.appendChild(el('span', 'onboarding-label', t('quiz.grade')));
    const grades = el('div', 'quiz-grades');
    grades.setAttribute('role', 'group');
    for (let g = 1; g <= 12; g++) {
      const b = el('button', 'quiz-grade' + (answers.grade === g ? ' is-picked' : ''), String(g));
      b.type = 'button';
      b.addEventListener('click', () => {
        answers.grade = g;
        grades.querySelectorAll('.quiz-grade').forEach(x => x.classList.toggle('is-picked', x === b));
      });
      grades.appendChild(b);
    }
    q.appendChild(grades);
    box.appendChild(q);
    const school = textField(t('onb.school'), answers.school, t('onb.schoolPlaceholder'), 120);
    school.control.id = 'onbSchool';
    box.appendChild(school);
  }

  let countryBox = null;
  let cityBox = null;

  function drawPlace(box) {
    const cityOptions = name => {
      const entry = places && places.countries.find(c => c[1] === name);
      const list = (entry && places.cities[entry[0]]) || [];
      // Bulgarian places carry both names; elsewhere there is one
      return list.map(c => Array.isArray(c)
        ? { value: c[0], label: bg() ? c[1] : c[0], also: bg() ? c[0] : c[1] }
        : { value: c, label: c });
    };
    cityBox = combo(t('onb.city'), { free: true });
    cityBox.control.id = 'onbCity';
    countryBox = combo(t('onb.country'), {
      free: false,
      onChange: name => { answers.city = null; cityBox.setOptions(cityOptions(name), null); },
    });
    countryBox.control.id = 'onbCountry';
    box.append(countryBox, cityBox);

    const fill = () => {
      if (!places) return;
      // Nothing is filled in for the person — an answer they did not give is
      // not an answer — but the likeliest country is put at the top of the list.
      const likely = bg() || /-BG$/i.test(navigator.language || '') ? 'Bulgaria' : null;
      const list = places.countries.map(c => ({ value: c[1], label: bg() ? c[2] : c[1], also: bg() ? c[1] : c[2] }));
      list.sort((a, b) => (b.value === likely) - (a.value === likely) || a.label.localeCompare(b.label, bg() ? 'bg' : 'en'));
      countryBox.setOptions(list, answers.country);
      cityBox.setOptions(cityOptions(answers.country), answers.city);
    };
    fill();
    if (!places) loadPlaces().then(() => { if (steps[index] === 'place' && countryBox && countryBox.isConnected) fill(); });
  }

  // What is on screen right now, into `answers`. Called before leaving a step
  // by Next — not by Skip, which leaves the question unanswered.
  function collect() {
    const step = steps[index];
    if (step === 'school') {
      const school = $('onbSchool') ? $('onbSchool').value.trim() : '';
      if (school) answers.school = school;
    } else if (step === 'place') {
      const country = countryBox ? countryBox.answer() : '';
      if (country) answers.country = country;
      const city = cityBox ? cityBox.answer() : '';
      if (city) answers.city = city.slice(0, 80);
    }
  }

  const COPY = {
    role:   { icon: 'compass', title: 'quiz.roleTitle', body: 'quiz.roleBody' },
    school: { icon: 'book',    title: 'onb.schoolTitle', body: 'onb.schoolBody' },
    place:  { icon: 'pin',     title: 'onb.placeTitle', body: 'onb.placeBody' },
    heard:  { icon: 'hello',   title: 'quiz.heardTitle', body: 'quiz.heardBody' },
    done:   { icon: 'check',   title: 'onb.doneTitle', body: 'onb.doneBody' },
  };

  function render() {
    const step = steps[index];
    const copy = COPY[step];
    $('onboarding').classList.toggle('is-done', step === 'done');
    $('onboardingIcon').innerHTML = iconSvg(copy.icon);
    $('onboardingTitle').textContent = t(copy.title);
    $('onboardingBody').textContent = t(copy.body);
    $('onboardingError').classList.add('hidden');

    const dots = $('onboardingSteps');
    dots.innerHTML = '';
    steps.forEach((_, i) => dots.appendChild(el('span', 'onboarding-dot' + (i === index ? ' active' : ''))));
    dots.setAttribute('aria-label', t('onb.progress', { n: index + 1, of: steps.length }));
    // In words, with what is already behind them counted: the account exists,
    // so the first thing the count says is that something is done. The last
    // step is not a question.
    const left = steps.length - 1 - index;
    $('onboardingCount').textContent = step === 'done' ? ''
      : t(left === 1 ? 'onb.leftOne' : 'onb.left', { n: left });

    const choices = $('onboardingChoices');
    const fields = $('onboardingFields');
    const next = $('onboardingNext');
    const skip = $('onboardingSkip');
    choices.innerHTML = '';
    fields.innerHTML = '';
    choices.classList.add('hidden');
    fields.classList.add('hidden');
    next.classList.remove('hidden');
    skip.classList.toggle('hidden', step === 'done');
    next.textContent = t(step === 'done' ? 'onboarding.start' : 'onboarding.next');

    if (step === 'role') {
      // A question with a few answers is answered by pressing one; a separate
      // Next would only be a second way of not answering.
      choices.classList.remove('hidden');
      next.classList.add('hidden');
      choiceButtons(choices, [['student', 'quiz.student'], ['parent', 'quiz.parent'], ['teacher', 'quiz.teacher']], role, pickRole);
    } else if (step === 'heard') {
      choices.classList.remove('hidden');
      next.classList.add('hidden');
      choiceButtons(choices, HEARD, answers.heard_from, value => { answers.heard_from = value; advance(); });
    } else if (step === 'school') {
      fields.classList.remove('hidden');
      drawSchool(fields);
    } else if (step === 'place') {
      fields.classList.remove('hidden');
      drawPlace(fields);
    }
    const first = $('onboarding').querySelector('.onboarding-choice, .quiz-grade, select, .btn-primary:not(.hidden)');
    if (first) first.focus({ preventScroll: true });
  }

  // ---- saving -------------------------------------------------------------

  function authed(path, method, body) {
    return Net.fetch(BACKEND + path, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Auth.getToken()}` },
      body: JSON.stringify(body),
    });
  }

  function pickRole(value) {
    role = value;
    const u = user();
    if (u && u.role !== value) {
      // Remembered here whatever the server says: a failed request must not
      // trap anyone on this screen, and the role can be changed in Settings.
      authed('/auth/role', 'POST', { role: value }).catch(() => {});
      Auth.updateUser({ ...u, role: value });
      window.dispatchEvent(new CustomEvent('climby:auth-changed', { detail: { loggedIn: true, user: { ...u, role: value } } }));
    }
    steps = stepsFor();
    advance();
  }

  // The same busy state every other button in the app uses (auth.js): the
  // button is locked and says so, because a sleeping server can take a while.
  async function save() {
    const body = {};
    for (const k of ['grade', 'school', 'country', 'city', 'heard_from']) if (answers[k]) body[k] = answers[k];
    if (!Object.keys(body).length) return true;
    const next = $('onboardingNext'), skip = $('onboardingSkip');
    const label = next.textContent;
    next.disabled = true; skip.disabled = true;
    next.textContent = t('auth.busy');
    try {
      const res = await authed('/account/profile', 'PATCH', body);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : t('account.errGeneric'));
      Auth.updateUser(data);
      return true;
    } catch (err) {
      const box = $('onboardingError');
      box.textContent = (err && err.message) || t('account.errGeneric');
      box.classList.remove('hidden');
      return false;
    } finally {
      next.disabled = false; skip.disabled = false;
      next.textContent = label;
    }
  }

  // ---- moving -------------------------------------------------------------

  let retried = false;
  // One advance at a time: the last question saves over the network, and a
  // second press while that was in flight moved the index past the end.
  let advancing = false;
  async function advance() {
    if (advancing) return;
    advancing = true;
    try {
      if (steps[index] === 'done') { finish(); return; }
      if (steps[index + 1] === 'done' && !saved) {
        const ok = await save();
        // One failed save shows the message and waits; pressing again moves on —
        // the answers can be given later in Settings, a dead end cannot be undone.
        if (!ok && !retried) { retried = true; return; }
        saved = true;
      }
      if (index < steps.length - 1) index++;
      render();
    } finally {
      advancing = false;
    }
  }

  function next() { collect(); advance(); }
  function skip() { advance(); }

  function markDone() {
    const u = user();
    try { if (u && u.id) localStorage.setItem(DONE_KEY + u.id, '1'); } catch { /* asked again next time, at worst */ }
  }

  function finish() {
    markDone();
    open = false;
    $('onboarding').classList.add('hidden');
    document.documentElement.classList.remove('onboarding-open');
    window.dispatchEvent(new CustomEvent('climby:onboarding-done'));
  }

  // Asked once per account, and only an account that has answered nothing yet:
  // someone who went through the earlier questions is not asked again.
  function needed(u) {
    if (!u || !u.id) return false;
    try { if (localStorage.getItem(DONE_KEY + u.id) === '1') return false; } catch { /* ask */ }
    return u.grade == null && !u.city && !u.country && !u.school && !u.heard_from;
  }

  function maybeShow() {
    if (open || !window.Auth || !Auth.isLoggedIn()) return;
    const u = user();
    if (!needed(u)) return;
    start(u);
  }

  function start(u) {
    role = (u && u.role) || 'student';
    answers = {};
    saved = false; retried = false;
    steps = stepsFor();
    index = 0;
    open = true;
    document.documentElement.classList.add('onboarding-open');
    $('onboarding').classList.remove('hidden');
    render();
    loadPlaces();   // ready by the time the question about place comes
  }

  function init() {
    $('onboardingNext').addEventListener('click', next);
    $('onboardingSkip').addEventListener('click', skip);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) finish();
    });
    window.addEventListener('climby:lang-changed', () => { if (open) render(); });
    window.addEventListener('climby:auth-changed', e => {
      if (e.detail && e.detail.loggedIn) maybeShow();
      else if (open) { open = false; $('onboarding').classList.add('hidden'); document.documentElement.classList.remove('onboarding-open'); }
    });
    // Already signed in when the app opens (a remembered session that never
    // answered): ask once the sign-in screen is out of the way.
    if ($('entryGate').classList.contains('hidden')) maybeShow();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Onboarding.init);
