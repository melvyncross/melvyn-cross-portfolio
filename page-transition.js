/**
 * Page Transition — Melvyn Cross Portfolio
 *
 * On exit  → navy curtain drops DOWN from top, showing MC initials
 * On enter → curtain ascends UP, revealing the new page
 *
 * No dependencies. Works via event delegation so it catches
 * dynamically rendered links (blog cards, etc.) automatically.
 */
(function () {

  /* ── Styles ── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .pt-curtain {
      position: fixed;
      inset: 0;
      background: #0A1628;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      will-change: transform;
      pointer-events: none;
    }

    .pt-curtain__mark {
      font-family: "Fraunces", "Times New Roman", serif;
      font-size: clamp(3.5rem, 10vw, 6rem);
      font-style: italic;
      font-weight: 400;
      letter-spacing: -0.03em;
      color: #F5EDE0;
      line-height: 1;
      user-select: none;
    }

    .pt-curtain__dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #F4A547;
      animation: ptPulse 2s ease-in-out infinite;
    }

    @keyframes ptPulse {
      0%, 100% { opacity: 0.35; transform: scale(0.8); }
      50%       { opacity: 1;    transform: scale(1.15); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ── Curtain element ── */
  const curtain = document.createElement('div');
  curtain.className = 'pt-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = `
    <span class="pt-curtain__mark">MC</span>
    <span class="pt-curtain__dot"></span>
  `;

  /* Start: curtain covers the page (translateY 0), no transition yet */
  curtain.style.cssText = 'transform: translateY(0); transition: none;';
  document.body.appendChild(curtain);

  /* ── Page ENTER: curtain ascends to reveal page ── */
  function revealPage() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        curtain.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        curtain.style.transform  = 'translateY(-100%)';
      })
    );
  }

  /* Run reveal as soon as the DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPage);
  } else {
    revealPage();
  }

  /* ── Page EXIT: catch link clicks, drop curtain then navigate ── */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    /* Skip: new-tab, anchor-only, protocol links */
    if (link.target === '_blank') return;
    if (href.startsWith('#'))          return;
    if (href.startsWith('mailto:'))    return;
    if (href.startsWith('tel:'))       return;
    if (href.startsWith('javascript:')) return;

    /* Skip: cross-origin */
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
    } catch (_) { return; }

    e.preventDefault();
    const destination = link.href;

    /* Curtain is currently off-screen above (translateY -100%).
       It drops DOWN from the top to cover the page. */
    curtain.style.pointerEvents = 'all';
    curtain.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
    curtain.style.transform  = 'translateY(0)';

    /* Navigate once the drop animation finishes */
    setTimeout(() => {
      window.location.href = destination;
    }, 640);
  });

})();
