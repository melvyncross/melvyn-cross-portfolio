/**
 * cp-content.js — Contact page content hydration
 * Injects Sanity-sourced text (via content.js) into data-i18n elements.
 * Also updates href attributes for email, phone, and LinkedIn links.
 */

import content from './content.js';

(function () {
  const lang = 'en'; // contact page is English-only
  const strings = content[lang];
  if (!strings) return;

  // ── Plain text / HTML injection ──────────────────────────────────────────
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] != null && strings[key] !== '') {
      el.innerHTML = strings[key];
    }
  });

  // ── Link href updates ─────────────────────────────────────────────────────
  // Update email href if Sanity provides a value
  if (strings.cp_email) {
    const emailLink = document.querySelector('[data-cp-email]');
    if (emailLink) emailLink.href = `mailto:${strings.cp_email}`;
  }
  // Update LinkedIn href
  if (strings.cp_linkedin_url) {
    const liLink = document.querySelector('[data-cp-linkedin]');
    if (liLink) liLink.href = strings.cp_linkedin_url;
  }
  // Update phone href
  if (strings.cp_phone_url) {
    const phoneLink = document.querySelector('[data-cp-phone]');
    if (phoneLink) phoneLink.href = `tel:${strings.cp_phone_url}`;
  }
})();
