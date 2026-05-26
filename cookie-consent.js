/**
 * Cookie Consent — Melvyn Cross Portfolio
 * GDPR-compliant notice bar. Injects itself, stores choice in localStorage.
 * No dependencies. Works across all pages.
 */
(function () {
  const KEY = 'mc_cookie_consent';
  if (localStorage.getItem(KEY)) return; // already decided, stay out of the way

  /* ── Styles ── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .cc-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      background: #0A1628;
      border-top: 1px solid rgba(245,237,224,0.08);
      padding: 1.25rem 2rem;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: "Inter Tight", system-ui, sans-serif;
      font-size: 0.875rem;
      line-height: 1.55;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.18);
    }
    [data-theme="dark"] .cc-bar {
      background: #141312;
      border-top-color: rgba(205,204,202,0.1);
    }
    .cc-bar--visible { transform: translateY(0); }

    .cc-bar__inner {
      max-width: 70rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .cc-bar__copy { flex: 1; min-width: 220px; }

    .cc-bar__title {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #F4A547;
      margin-bottom: 0.2rem;
    }

    .cc-bar__text {
      color: rgba(232, 224, 208, 0.72);
      font-size: 0.82rem;
      line-height: 1.6;
    }
    .cc-bar__text a {
      color: rgba(232,224,208,0.55);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .cc-bar__text a:hover { color: #E8E0D0; }

    .cc-bar__actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-shrink: 0;
    }

    .cc-btn {
      cursor: pointer;
      border: none;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.63rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 100px;
      transition: background 0.2s, color 0.2s, opacity 0.2s;
    }
    .cc-btn:focus-visible {
      outline: 2px solid #F4A547;
      outline-offset: 3px;
    }
    .cc-btn--accept {
      background: #F4A547;
      color: #0A1628;
      padding: 0.55rem 1.35rem;
      font-weight: 500;
    }
    .cc-btn--accept:hover { background: #D88416; }

    .cc-btn--decline {
      background: transparent;
      color: rgba(232,224,208,0.45);
      padding: 0.55rem 0.75rem;
    }
    .cc-btn--decline:hover { color: rgba(232,224,208,0.85); }

    @media (max-width: 600px) {
      .cc-bar { padding: 1rem 1.25rem; }
      .cc-bar__inner { gap: 1rem; }
      .cc-bar__text { font-size: 0.78rem; }
      .cc-bar__actions { width: 100%; justify-content: flex-end; }
    }
  `;
  document.head.appendChild(styleEl);

  /* ── Markup ── */
  const bar = document.createElement('div');
  bar.className = 'cc-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-modal', 'false');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML = `
    <div class="cc-bar__inner">
      <div class="cc-bar__copy">
        <p class="cc-bar__title">Cookie notice</p>
        <p class="cc-bar__text">
          This site stores your theme preference locally. No advertising, no third-party tracking.
          Analytics may be added in future — only if you accept.
        </p>
      </div>
      <div class="cc-bar__actions">
        <button class="cc-btn cc-btn--accept" id="cc-accept">Accept</button>
        <button class="cc-btn cc-btn--decline" id="cc-decline">Decline</button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);

  /* ── Show (double rAF ensures the initial translateY is painted first) ── */
  requestAnimationFrame(() =>
    requestAnimationFrame(() => bar.classList.add('cc-bar--visible'))
  );

  /* ── Dismiss ── */
  function dismiss(choice) {
    localStorage.setItem(KEY, choice);
    bar.classList.remove('cc-bar--visible');
    setTimeout(() => bar.remove(), 450);
  }

  document.getElementById('cc-accept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cc-decline').addEventListener('click', () => dismiss('declined'));
})();
