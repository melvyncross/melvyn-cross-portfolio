/**
 * qua-content.js — Qualifications page content hydration
 * Injects Sanity-sourced text (via content.js) into data-i18n elements.
 * Skill tags use data-skills attribute and are rendered as <span> chips.
 */

import content from './content.js';

function applyContent(lang) {
  const strings = content[lang] || content['en'];
  if (!strings) return;

  // ── Plain text / HTML injection ──────────────────────────────────────────
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] != null && strings[key] !== '') {
      el.innerHTML = strings[key];
    }
  });

  // ── Skill tag lists ───────────────────────────────────────────────────────
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

  // ── Editorial section + label ─────────────────────────────────────────────
  const ed = document.getElementById('qua-editorial');
  if (ed && strings.qua_editorial) ed.innerHTML = strings.qua_editorial;
  const edLabel = document.getElementById('qua-editorial-label');
  if (edLabel) edLabel.textContent = lang === 'fr' ? 'Pourquoi c’est important' : 'Why this matters';
}

// Apply on load using stored preference
let currentLang = localStorage.getItem('mc_lang') || 'en';
applyContent(currentLang);

// Re-apply when lang toggle is clicked
document.getElementById('lang-toggle')?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  applyContent(currentLang);
});
