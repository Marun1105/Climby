// tutor.js — the conversation with the AI tutor: the photographed pages are the
// context, the student asks, the tutor answers, the student replies, and so on.
//
// It was a single question and a single answer. Every method the research
// points to — hold the solution back, ask one guiding question, make the
// student explain — assumes the student can answer. A question nobody can reply
// to is rhetoric. So the answer card became a thread with a reply box under it.
//
// The first question about a page is different from the rest. The server has
// the stronger model read the photographs once and keeps what it read; every
// reply after that names the page by id instead of uploading it again. That
// first answer takes about half a minute, so it is two requests: /read, whose
// result ("what I read") is shown as soon as it exists, then /ask. A misread
// number can be caught before the explanation built on it is believed, and the
// wait is two short ones with a real step between them.
const Tutor = (() => {
  const $ = id => document.getElementById(id);
  const BACKEND = window.CLIMBY_BACKEND;
  let scannedImages = []; // base64 (без "data:image/jpeg;base64," префикса), една или няколко страници
  // The conversation so far, as the server wants it: {role, text}, in order.
  // Cleared when new pages are photographed — a new page is a new conversation.
  let history = [];
  let busy = false;
  // Bumped whenever the thread starts over (new pages, a new first question).
  // An answer that arrives for an older thread is dropped, not drawn under
  // the new page.
  let epoch = 0;
  // The page as the server read it. Null when the read failed (or the server is
  // older than the relay): then the photographs go with every turn, as before.
  let briefId = null;
  // The progress bar runs on a timer; this stops it.
  let stopSteps = null;

  function revealQuestionBox(dataUrls) {
    scannedImages = dataUrls.map(u => u.split(',')[1]);
    resetThread();
    $('qa').classList.remove('hidden');
    $('question').focus();
    $('question').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetThread() {
    epoch++;
    busy = false;
    clearSteps();
    history = [];
    briefId = null;
    triedFirst = false;
    hideRead();
    $('answer').classList.add('hidden');
    $('answer').innerHTML = '';
    $('thread').innerHTML = '';
    $('followUp').classList.add('hidden');
    inFlight = null;
    if (window.Speak) Speak.stop();
  }

  // Markdown + LaTeX into `el`, after `prefix`. The AI's text is untrusted:
  // no DOMPurify, no HTML.
  function renderMarkdown(text, el, prefix = '') {
    const html = window.Md ? Md.toHtml(text) : null;
    if (html !== null) {
      el.innerHTML = prefix + html;
    } else {
      el.innerHTML = prefix;
      const plain = document.createElement('div');
      plain.textContent = text;
      el.appendChild(plain);
    }
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  function renderAnswer(text, el) {
    el.classList.remove('error');
    renderMarkdown(text, el, window.aiBadgeHtml());
    // The speaker goes on after the maths is rendered, so what it reads is
    // what is on screen — and it removes anything still speaking.
    if (window.Speak) Speak.attach(el);
    if (window.Copy) Copy.attach(el);
  }

  // What the stronger model read off the photographs, folded shut above the
  // first answer. Never the worked solution: that stays on the server.
  function showRead(text) {
    const panel = $('readPanel');
    if (!panel) return;
    renderMarkdown(text, panel.querySelector('.read-body'));
    panel.open = true;
    panel.classList.remove('hidden');
  }

  function hideRead() {
    const panel = $('readPanel');
    if (!panel) return;
    panel.classList.add('hidden');
    panel.open = false;
    panel.querySelector('.read-body').innerHTML = '';
  }

  function clearSteps() {
    if (stopSteps) stopSteps();
    stopSteps = null;
  }

  function showError(el, text) {
    clearSteps();
    el.classList.remove('thinking', 'reading');
    el.classList.add('error');
    el.textContent = text;
  }

  // Every wait can be stopped: a Cancel button under whatever is waiting.
  function cancelButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wait-cancel';
    btn.textContent = t('scanner.cancel');
    btn.addEventListener('click', cancel);
    return btn;
  }

  function showThinking(el) {
    clearSteps();
    el.classList.remove('hidden', 'error', 'reading');
    el.classList.add('thinking');
    el.replaceChildren(AIActivity.create('thinking', t('scanner.thinking'), false, { phases: 'followup' }));
    const aside = document.createElement('span');
    aside.className = 'thinking-quip';
    aside.setAttribute('aria-hidden', 'true');
    aside.textContent = I18n.loadingAside();
    el.append(aside, cancelButton());
  }

  // The first question about a page is two real requests: the page is read,
  // then the explanation is written. Each stage on screen is one of them — the
  // label changes when the server has actually finished reading, not on a
  // timer. The bar inside a stage is an estimate from measured times (reading
  // about 20 s, explaining about 15 s); it slows as it nears the end of its
  // stage and never claims a stage is done before it is.
  const STAGES = [
    { key: 'scanner.stepRead', from: 0, to: 55, tau: 12000 },
    { key: 'scanner.stepWrite', from: 55, to: 96, tau: 10000 },
  ];

  function showReading(el) {
    clearSteps();
    el.classList.remove('hidden', 'error');
    el.classList.add('thinking', 'reading');
    el.innerHTML = '';
    el.appendChild(AIActivity.create('reading', t('loading.reading'), false, { timer: true }));

    const count = document.createElement('p');
    count.className = 'wait-stage';
    const bar = document.createElement('div');
    bar.className = 'wait-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const fill = document.createElement('span');
    fill.className = 'wait-bar-fill';
    bar.appendChild(fill);
    const note = document.createElement('p');
    note.className = 'read-note';
    note.textContent = t('scanner.readingNote');
    // The wait is the moment to ask what was tried: it gives the tutor a place
    // to start, and it is the attempt the full solution waits for. Optional —
    // an empty box changes nothing.
    const tried = document.createElement('label');
    tried.className = 'wait-tried';
    const triedText = document.createElement('span');
    triedText.textContent = t('scanner.triedLabel');
    const triedBox = document.createElement('textarea');
    triedBox.id = 'triedBox';
    triedBox.rows = 2;
    triedBox.maxLength = 400;
    triedBox.placeholder = t('scanner.triedPlaceholder');
    tried.append(triedText, triedBox);
    el.append(count, bar, note, tried, cancelButton());

    let stage = 0;
    let since = Date.now();
    const label = () => {
      count.textContent = t('scanner.stageOf', { n: stage + 1, total: STAGES.length, what: t(STAGES[stage].key) });
    };
    const draw = () => {
      const st = STAGES[stage];
      const pct = st.from + (st.to - st.from) * (1 - Math.exp(-(Date.now() - since) / st.tau));
      fill.style.width = pct.toFixed(1) + '%';
      bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    };
    label(); draw();
    const timer = setInterval(draw, 400);
    stopSteps = () => clearInterval(timer);
    // Called when the server has really finished the stage before.
    return { next() { if (stage + 1 < STAGES.length) { stage++; since = Date.now(); label(); draw(); } } };
  }

  // A follow-up: the student's words as a small bubble, then a fresh answer card
  // under it. The first answer keeps the original #answer card, so nothing that
  // knew about it has to change.
  function appendUserTurn(text) {
    const b = document.createElement('div');
    b.className = 'turn-user';
    const who = document.createElement('span');
    who.className = 'turn-who';
    who.textContent = t('scanner.you');
    const body = document.createElement('p');
    body.textContent = text;
    b.append(who, body);
    $('thread').appendChild(b);
    return b;
  }

  function appendAnswerCard() {
    const c = document.createElement('div');
    c.className = 'card answer';
    c.setAttribute('role', 'status');
    c.setAttribute('aria-live', 'polite');
    $('thread').appendChild(c);
    return c;
  }

  function headers() {
    // Въпросът минава и без вход — затова токенът се праща само ако го има.
    // Без него сървърът не знае чий е въпросът и не го записва в историята.
    const token = Auth.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Stage one of a first question: the page is read and nothing is answered.
  function postRead(question, signal) {
    return Net.fetch(BACKEND + '/read', {
      timeout: Net.AI_TIMEOUT_MS,
      loadingKey: 'loading.reading',
      method: 'POST',
      signal,
      headers: headers(),
      body: JSON.stringify({ images: scannedImages, question, lang: I18n.get() }),
    });
  }

  // withPages: send the photographs (no brief to name: the read failed, or the
  // server is older than /read). mode: "full" for one reply, when the student
  // asked for the whole solution after trying.
  function post(question, withPages, signal, mode, skipRead) {
    const token = Auth.getToken();
    const reading = withPages && !history.length;
    return Net.fetch(BACKEND + '/ask', {
      // Тук отиват снимани страници и се чака дълго обяснение. Първият въпрос
      // чака и прочитането на страницата, затова срокът му е по-дълъг.
      timeout: reading ? Net.AI_READ_TIMEOUT_MS : Net.AI_TIMEOUT_MS,
      loadingKey: reading ? 'loading.reading' : 'loading.ai',
      method: 'POST',
      signal,
      headers: headers(),
      body: JSON.stringify({
        images: withPages ? scannedImages : [],
        brief_id: withPages ? null : briefId,
        skip_read: !!skipRead,
        question, lang: I18n.get(), history: Net.trimHistory(history),
        mode: mode || (window.Prefs ? Prefs.get('tutor') : 'hints'),
        surface: 'tutor',
        memory: token && window.Memory ? Memory.request() : null,
      }),
    });
  }

  // Did the student say what they tried while the page was being read?
  let triedFirst = false;

  // The request in flight, so Cancel can stop it, and what to put back.
  let inFlight = null;

  function cancel() {
    if (!inFlight) return;
    const { controller, target, question, first, bubble } = inFlight;
    inFlight = null;
    epoch++;
    busy = false;
    clearSteps();
    controller.abort();
    target.classList.remove('thinking', 'reading');
    if (first) {
      // Back to the question box, with the question still in it.
      target.classList.add('hidden');
      target.innerHTML = '';
      briefId = null;
      hideRead();
      $('question').focus();
    } else {
      target.remove();
      if (bubble) bubble.remove();
      $('followQuestion').value = question;
      $('followQuestion').focus();
    }
  }

  // The answer arrived while the student was somewhere else in the app.
  function announceIfAway() {
    const away = document.hidden || !(window.Nav && Nav.currentView && Nav.currentView() === 'tutor');
    if (away && window.Toast) Toast.show(t('scanner.answerReady'));
  }

  // After each answer: what can be asked next with one press. The whole
  // solution is offered once the student has replied at least once — an
  // attempt first, then the answer (docs/ux-research-deep-2026-11.md, 17-18).
  function updateQuickReplies() {
    const replies = history.filter(h => h.role === 'user').length - 1;
    const unlocked = replies >= 1 || triedFirst;
    $('fullSolutionBtn').classList.toggle('hidden', !unlocked);
    $('solutionGate').classList.toggle('hidden', unlocked);
  }

  // Once per visit, to a guest, after the first real answer: one quiet line.
  let guestAsked = false;
  function offerAccount() {
    if (guestAsked || Auth.isLoggedIn()) return;
    guestAsked = true;
    $('guestKeep').classList.remove('hidden');
  }

  async function send(question, target, opts = {}) {
    let attempted = false;
    busy = true;
    const asked = epoch;
    const first = !history.length;
    const controller = new AbortController();
    inFlight = { controller, target, question, first, bubble: opts.bubble || null };
    const progress = first ? showReading(target) : (showThinking(target), null);
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    try {
      let res = null;
      if (first) {
        // Read first. Anything but a clear refusal falls back to the single
        // request that reads and answers together, which is what older
        // servers offer and what a failed read needs anyway.
        let read = null;
        let readFailed = false;
        try { read = await postRead(question, controller.signal); } catch (err) {
          if (controller.signal.aborted) throw err;
        }
        if (asked !== epoch) return false;
        if (read && (read.status === 429 || read.status === 413 || read.status === 422)) {
          res = read;
        } else if (read && read.ok) {
          const page = await read.json().catch(() => ({}));
          if (asked !== epoch) return false;
          // An empty brief: the reader was tried and failed. The tutor reads
          // the photographs; the reader is not asked a second time.
          readFailed = !page.brief_id;
          briefId = page.brief_id || null;
          if (page.read) showRead(page.read);
          Net.noteSession(read);
        }
        if (!res) {
          progress.next();
          // What the student typed while the page was being read goes with the
          // question. After this point the box is closed: it can no longer be sent.
          const box = document.getElementById('triedBox');
          const tried = box ? box.value.trim() : '';
          if (box) box.closest('.wait-tried').remove();
          attempted = !!tried;
          // Together they must fit the server's 2000 characters for a question.
          const extra = '\n\n' + t('scanner.triedPrefix') + ' ' + tried;
          if (tried) question = (question + extra).slice(0, 2000);
          res = await post(question, !briefId, controller.signal, opts.mode, readFailed);
        }
      } else {
        res = await post(question, !briefId, controller.signal, opts.mode);
        // 410: the server no longer has the page it read. The photographs are
        // still here — send them instead, once, and carry on without a brief.
        if (res.status === 410) {
          briefId = null;
          res = await post(question, true, controller.signal, opts.mode);
        }
      }
      const data = await res.json().catch(() => ({}));
      if (asked !== epoch) return false;
      clearSteps();
      target.classList.remove('thinking', 'reading');
      if (!res.ok) {
        // сървърът праща разбираем текст (лимит, грешка от AI и т.н.) в data.detail — показваме него, ако го има
        showError(target, typeof data.detail === 'string' && data.detail ? data.detail : t('scanner.errOffline'));
        return false;
      }
      if (!data.answer) {
        showError(target, t('scanner.errNoAnswer'));
        return false;
      }
      if (first && !briefId) {
        briefId = data.brief_id || null;
        if (data.read) showRead(data.read);
      }
      window.dispatchEvent(new CustomEvent('climby:activity'));
      const took = AIActivity.seconds(target);
      renderAnswer(data.answer, target);
      AIActivity.sign(target, took);
      history.push({ role: 'user', text: question }, { role: 'assistant', text: data.answer });
      if (attempted) triedFirst = true;
      $('followUp').classList.remove('hidden');
      updateQuickReplies();
      announceIfAway();
      if (first) offerAccount();
      Net.noteSession(res);
      return true;
    } catch (err) {
      if (asked !== epoch) return false;
      // An abort is the time limit, not the network: "check your internet" to
      // someone whose internet is fine sends them looking in the wrong place.
      showError(target, t(err && err.name === 'AbortError' ? 'scanner.errSlow' : 'scanner.errOffline'));
      return false;
    } finally {
      // A stale request leaves the new thread's state alone.
      if (asked === epoch) {
        clearSteps();
        busy = false;
        inFlight = null;
      }
    }
  }

  async function ask() {
    const question = $('question').value.trim();
    if (!question || !scannedImages.length || busy) return;
    // The first question starts the conversation over: the pages are the same,
    // but a new opening question is a new thread — and it is read again, since
    // the reading is scoped to the problem asked about.
    epoch++;
    history = [];
    briefId = null;
    triedFirst = false;
    hideRead();
    $('thread').innerHTML = '';
    await send(question, $('answer'));
  }

  async function followUp() {
    const text = $('followQuestion').value.trim();
    if (!text || busy || !history.length) return;
    $('followQuestion').value = '';
    const bubble = appendUserTurn(text);
    const ok = await send(text, appendAnswerCard(), { bubble });
    if (ok) $('followQuestion').focus();
  }

  // A reply sent by a button instead of typed. mode "full" asks for the whole
  // solution for this one reply.
  async function quickReply(key, mode) {
    if (busy || !history.length) return;
    const text = t(key);
    const bubble = appendUserTurn(text);
    await send(text, appendAnswerCard(), { bubble, mode });
  }

  function init() {
    window.addEventListener('climby:scan-ready', e => revealQuestionBox(e.detail.dataUrls));
    $('askBtn').addEventListener('click', () => Net.guardClick($('askBtn'), ask));
    // Quick questions fill the box; the person can still edit before sending.
    document.querySelectorAll('.quick').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = $('question');
        box.value = t(btn.dataset.quick);
        box.focus();
        if (btn.dataset.quickFocus) { box.setSelectionRange(box.value.length, box.value.length); return; }
        Net.guardClick($('askBtn'), ask);
      });
    });
    $('question').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); Net.guardClick($('askBtn'), ask); }
    });
    $('followBtn').addEventListener('click', () => Net.guardClick($('followBtn'), followUp));
    $('explainAgainBtn').addEventListener('click', () => quickReply('scanner.explainAgainText'));
    $('fullSolutionBtn').addEventListener('click', () => quickReply('scanner.fullSolutionText', 'full'));
    // "Not right? Fix it": the correction is an ordinary reply; the tutor is
    // told to trust the student's version of the page over its own reading.
    $('readFixBtn').addEventListener('click', () => {
      const box = history.length ? $('followQuestion') : $('question');
      if (history.length) box.value = t('scanner.readFixText');
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    });
    $('guestKeepBtn').addEventListener('click', () => { $('guestKeep').classList.add('hidden'); Auth.openEntryGate(); });
    $('guestKeepClose').addEventListener('click', () => $('guestKeep').classList.add('hidden'));
    // Enter sends, Shift+Enter is a new line — the way every chat works.
    $('followQuestion').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); Net.guardClick($('followBtn'), followUp); }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Tutor.init);
