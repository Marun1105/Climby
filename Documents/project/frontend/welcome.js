// welcome.js — the first screen: the headline arrives word by word.
//
// Pure decoration on top of a screen that works without it: the text is in the
// HTML, and with reduced motion (or without this file) it is simply there.
const Welcome = (() => {
  const $ = id => document.getElementById(id);

  function reveal() {
    const title = $('welcomeTitle');
    if (!title) return;
    const text = title.textContent.trim();
    title.setAttribute('aria-label', text);
    title.textContent = '';
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'welcome-word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i);
      span.textContent = word;
      title.appendChild(span);
      title.appendChild(document.createTextNode(' '));
    });
    // the lines under the headline follow it in
    const panel = $('welcomePanel');
    panel.style.setProperty('--words', text.split(/\s+/).length);
    panel.classList.remove('is-in');
    void panel.offsetWidth;          // restart the animation when the language changes
    panel.classList.add('is-in');
  }

  function init() {
    if (!$('welcomePanel')) return;
    reveal();
    // i18n puts the plain sentence back when the language changes
    window.addEventListener('climby:lang-changed', () => setTimeout(reveal, 0));
  }

  document.addEventListener('DOMContentLoaded', init);
  return { reveal };
})();

window.Welcome = Welcome;
