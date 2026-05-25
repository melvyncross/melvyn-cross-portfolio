/* ============================================================
   MELVYN CROSS — PORTFOLIO SCRIPT
   Vanilla JS. No deps. Performant.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- 1. INTERSECTION REVEALS ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal], section[data-section]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- 2. NUMBER COUNTERS ---------- */
  /* Count from 0 → target with easing. Triggered once per element. */
  const counters = document.querySelectorAll('[data-counter]');

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const formatNumber = (n, target) => {
    /* Always group with comma so the leading zero typography stays consistent */
    if (target >= 1000) return Math.floor(n).toLocaleString('en-US');
    return String(Math.floor(n));
  };

  const runCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = target > 100000 ? 2200 : 1500;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = eased * target;
      el.textContent = formatNumber(value, target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target, target) + suffix;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 3. SUN PARALLAX ---------- */
  /* Translates the hero sun based on scroll. Pure transform = 60fps. */
  const sun = document.querySelector('.hero__sun');
  let ticking = false;

  const updateParallax = () => {
    if (!sun) return;
    const y = window.scrollY;
    const heroH = window.innerHeight;
    if (y < heroH * 1.2) {
      const offset = y * 0.35;
      sun.style.transform = `translate3d(${y * 0.08}px, ${offset}px, 0) scale(${1 + y * 0.0004})`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- 4. CV DOWNLOAD HANDLER ---------- */
  /* If a CV is published at /Melvyn_Cross_CV.pdf, link to it.
     Otherwise, fall back to mailto. */
  const cvBtn = document.getElementById('cv-download');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      /* Try fetching a CV file in the site root */
      fetch('Melvyn_Cross_CV.pdf', { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const a = document.createElement('a');
            a.href = 'Melvyn_Cross_CV.pdf';
            a.download = 'Melvyn_Cross_CV.pdf';
            a.click();
          } else {
            window.location.href = 'mailto:melvyn.cross05@gmail.com?subject=CV%20request&body=Hi%20Melvyn%2C%20could%20you%20send%20me%20your%20CV%3F';
          }
        })
        .catch(() => {
          window.location.href = 'mailto:melvyn.cross05@gmail.com?subject=CV%20request';
        });
    });
  }

  /* ---------- 5. SMOOTH NAV LINK ---------- */
  /* The nav mark scrolls to top. */
  const navMark = document.querySelector('.nav__mark');
  if (navMark) {
    navMark.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
