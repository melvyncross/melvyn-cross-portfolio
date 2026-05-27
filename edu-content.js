/**
 * edu-content.js — Education page content hydration
 * Injects Sanity-sourced text (via content.js) into data-i18n elements.
 * Module tags use data-modules attribute and are rendered as <span> chips.
 */

import content from './content.js';

(function () {
  const lang = 'en'; // education page is English-only
  const strings = content[lang];
  if (!strings) return;

  // ── Plain text / HTML injection ──────────────────────────────────────────
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] != null && strings[key] !== '') {
      el.innerHTML = strings[key];
    }
  });

  // ── Module / tag lists ────────────────────────────────────────────────────
  // Elements with data-modules="key" get their comma-separated value rendered
  // as individual <span class="edu-tag"> elements.
  document.querySelectorAll('[data-modules]').forEach(el => {
    const key = el.dataset.modules;
    const raw = strings[key];
    if (!raw) return;
    el.innerHTML = raw
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map(m => `<span class="edu-tag">${m}</span>`)
      .join('');
  });
})();
