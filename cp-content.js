/**
 * cp-content.js — Contact page content hydration
 * Injects Sanity-sourced text (via content.js) into data-i18n elements.
 * Also updates href attributes for email, phone, and LinkedIn links.
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

  // ── Link href updates ─────────────────────────────────────────────────────
  if (strings.cp_email) {
    const emailLink = document.querySelector('[data-cp-email]');
    if (emailLink) emailLink.href = `mailto:${strings.cp_email}`;
  }
  if (strings.cp_linkedin_url) {
    const liLink = document.querySelector('[data-cp-linkedin]');
    if (liLink) liLink.href = strings.cp_linkedin_url;
  }
  if (strings.cp_phone_url) {
    const phoneLink = document.querySelector('[data-cp-phone]');
    if (phoneLink) phoneLink.href = `tel:${strings.cp_phone_url}`;
  }
}

// Apply on load using stored preference
let currentLang = localStorage.getItem('mc_lang') || 'en';
applyContent(currentLang);

// Re-apply when lang toggle is clicked
document.getElementById('lang-toggle')?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  applyContent(currentLang);
});
