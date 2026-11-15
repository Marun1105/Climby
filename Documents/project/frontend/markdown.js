// markdown.js — the AI's Markdown as safe HTML, with the maths left alone.
//
// marked reads backslashes and stars as Markdown before KaTeX ever sees the
// formula: "\{1,2\}" lost its braces, "\\" (the line break in a system of
// equations) became "\", "50\%" hid the rest of the formula, and two formulas
// with a star in each turned italic. So every $…$ and $$…$$ is lifted out
// first, the rest goes through marked and DOMPurify, and the formulas are put
// back — escaped, as text — for KaTeX to render.
const Md = (() => {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function toHtml(text) {
    if (!(window.marked && window.DOMPurify)) return null;
    const kept = [];
    const hold = m => { kept.push(m); return `climbymath${kept.length - 1}end`; };
    const lifted = String(text)
      .replace(/\$\$[\s\S]+?\$\$/g, hold)
      // inline: starts and ends on a non-space, stays on one line — so
      // "costs $5, or $10" is not taken for a formula
      .replace(/\$(?!\s)(?:\\.|[^$\\\n])+?(?<!\s)\$/g, hold);
    const html = DOMPurify.sanitize(marked.parse(lifted));
    return html.replace(/climbymath(\d+)end/g, (m, i) => (kept[+i] !== undefined ? esc(kept[+i]) : m));
  }

  return { toHtml };
})();

window.Md = Md;
