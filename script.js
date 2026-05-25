/* ============================================================
   MELVYN CROSS — PORTFOLIO SCRIPT  v2.0
   Vanilla JS. No deps. Performant.
   ============================================================ */

import content from './content.js';

(() => {
  'use strict';

  /* ──────────────────────────────────────────────
     0. LANGUAGE / i18n
     ────────────────────────────────────────────── */
  const STORAGE_KEY = 'mc_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const langToggle = document.getElementById('lang-toggle');

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const strings = content[lang];

    // Replace innerHTML for data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[key] !== undefined) {
        el.innerHTML = strings[key];
      }
    });

    // Replace alt attributes for images
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.dataset.i18nAlt;
      if (strings[key] !== undefined) {
        el.alt = strings[key];
      }
    });

    // Update toggle label: show the OTHER language
    if (langToggle) {
      langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
      langToggle.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
    }
  }

  // Apply saved or default language on load
  applyLang(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'fr' : 'en');
    });
  }

  /* ──────────────────────────────────────────────
     1. INTERSECTION REVEALS
     ────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────
     2. NUMBER COUNTERS
     ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const formatNumber = (n, target) => {
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

  /* ──────────────────────────────────────────────
     3. SUN PARALLAX
     ────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────
     4. CV DOWNLOAD HANDLER
     ────────────────────────────────────────────── */
  const cvBtn = document.getElementById('cv-download');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
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

  /* ──────────────────────────────────────────────
     5. SMOOTH NAV LINK
     ────────────────────────────────────────────── */
  const navMark = document.querySelector('.nav__mark');
  if (navMark) {
    navMark.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
     6. SCROLL PROGRESS BAR
     ────────────────────────────────────────────── */
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ──────────────────────────────────────────────
     7. CUSTOM CURSOR (fine pointer / mouse only)
     ────────────────────────────────────────────── */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !prefersReducedMotion) {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      let isVisible = false;
      let rafId;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
          cursor.classList.remove('cursor--hidden');
          isVisible = true;
        }
      });

      document.addEventListener('mouseleave', () => {
        cursor.classList.add('cursor--hidden');
        isVisible = false;
      });

      document.addEventListener('mouseenter', () => {
        cursor.classList.remove('cursor--hidden');
        isVisible = true;
      });

      // Enlarge cursor on interactive elements
      const interactives = 'a, button, [role="button"]';
      document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--large'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--large'));
      });

      // Lerp animation loop
      const ease = 0.12;
      const animateCursor = () => {
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        rafId = requestAnimationFrame(animateCursor);
      };
      animateCursor();
    }
  }

  /* ──────────────────────────────────────────────
     8. WORD-SPLIT TEXT REVEAL (h2 elements)
     ────────────────────────────────────────────── */
  if (!prefersReducedMotion) {
    // Split text nodes in headings into word spans
    // Handles mixed HTML (em, strong, etc.) by walking child nodes
    const splitHeading = (heading) => {
      // Collect all child nodes
      const nodes = Array.from(heading.childNodes);
      heading.innerHTML = '';

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Split plain text into words
          const words = node.textContent.split(/(\s+)/);
          words.forEach(word => {
            if (/^\s+$/.test(word)) {
              // Preserve whitespace as text node
              heading.appendChild(document.createTextNode(word));
            } else if (word.length > 0) {
              const wrapper = document.createElement('span');
              wrapper.className = 'reveal-word';
              const inner = document.createElement('span');
              inner.className = 'reveal-word__inner';
              inner.textContent = word;
              wrapper.appendChild(inner);
              heading.appendChild(wrapper);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // For inline elements (em, strong), wrap the whole element
          const wrapper = document.createElement('span');
          wrapper.className = 'reveal-word';
          const inner = document.createElement('span');
          inner.className = 'reveal-word__inner';
          inner.appendChild(node.cloneNode(true));
          wrapper.appendChild(inner);
          heading.appendChild(wrapper);
        }
      });
    };

    // Apply stagger delays after splitting
    const applyStagger = (heading) => {
      const inners = heading.querySelectorAll('.reveal-word__inner');
      inners.forEach((inner, i) => {
        inner.style.setProperty('--reveal-delay', `${i * 60}ms`);
      });
    };

    // Target h2s that are not the hero title (hero already has its own animation)
    const headingsToReveal = document.querySelectorAll(
      '.beginning__title, .built__title, .deals__title, .fasep__title, .bring__title, .contact__cta'
    );

    headingsToReveal.forEach(h => {
      splitHeading(h);
      applyStagger(h);
    });
  }

  /* ──────────────────────────────────────────────
     9. PORTRAIT: show placeholder if image 404s
     ────────────────────────────────────────────── */
  const portraitImg = document.querySelector('.hero__portrait-img');
  const portraitPlaceholder = document.querySelector('.hero__portrait-placeholder');

  if (portraitImg && portraitPlaceholder) {
    portraitImg.addEventListener('error', () => {
      portraitImg.style.display = 'none';
      portraitPlaceholder.style.display = 'flex';
    });

    // Also check if image loaded successfully (handles cached 404s)
    if (portraitImg.complete && portraitImg.naturalWidth === 0) {
      portraitImg.style.display = 'none';
      portraitPlaceholder.style.display = 'flex';
    }
  }

})();
