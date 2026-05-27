/**
 * qua-content.js — Qualifications page content hydration
 * Injects Sanity-sourced text (via content.js) into data-i18n elements.
 * Skill tags use data-skills attribute and are rendered as <span> chips.
 */

import content from './content.js';

(function () {
  const lang = 'en'; // qualifications page is English-only
  const strings = content[lang];
  if (!strings) return;

  // ── Plain text / HTML injection ──────────────────────────────────────────
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] != null && strings[key] !== '') {
      el.innerHTML = strings[key];
    }
  });

  // ── Skill tag lists ───────────────────────────────────────────────────────
  // Elements with data-skills="key" get rendered as <span class="qua-skill">.
  document.querySelectorAll('[data-skills]').forEach(el => {
    const key = el.dataset.skills;
    const raw = strings[key];
    if (!raw) return;
    el.innerHTML = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<span class="qua-skill">${s}</span>`)
      .join('');
  });
})();
