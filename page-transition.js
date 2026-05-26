/**
 * Page Transition — Melvyn Cross Portfolio
 *
 * The curtain <div id="pt-curtain"> is baked into every HTML file as the
 * FIRST child of <body>, so it covers the page before any content paints.
 * This script just animates it — no DOM injection, no flash, no jitter.
 *
 * Enter → curtain ascends upward, revealing the page  (1.1 s ease-out)
 * Exit  → curtain drops down from top, covering page   (0.9 s ease-in-out)
 */
(function () {

  var curtain = document.getElementById('pt-curtain');
  if (!curtain) return;

  /* ── Pulse animation for the amber dot ── */
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.pt-dot{animation:ptPulse 2s ease-in-out infinite}',
    '@keyframes ptPulse{',
    '  0%,100%{opacity:.35;transform:scale(.8)}',
    '  50%    {opacity:1;transform:scale(1.15)}',
    '}'
  ].join('');
  document.head.appendChild(styleEl);

  /* ── ENTER: curtain ascends to reveal page ── */
  /* Short timeout (not rAF) gives the browser time to register the
     initial translateY(0) before we begin the transition.            */
  setTimeout(function () {
    curtain.style.transition = 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1)';
    curtain.style.transform  = 'translateY(-100%)';
  }, 60);

  /* ── EXIT: intercept same-site link clicks ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href)                          return;
    if (link.target === '_blank')       return;
    if (href.charAt(0) === '#')         return;
    if (href.indexOf('mailto:') === 0)  return;
    if (href.indexOf('tel:')    === 0)  return;
    if (href.indexOf('javascript:') === 0) return;

    /* Cross-origin guard */
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
    } catch (_) { return; }

    e.preventDefault();
    var destination = link.href;

    /* Curtain is off-screen above (-100%). Drop it down from the top. */
    curtain.style.pointerEvents = 'all';
    curtain.style.transition    = 'transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)';
    curtain.style.transform     = 'translateY(0)';

    /* Navigate once the drop animation finishes */
    setTimeout(function () {
      window.location.href = destination;
    }, 940);
  });

})();
