/* ============================================================
   MELVYN CROSS — PORTFOLIO SCRIPT  v2.0
   Vanilla JS. No deps. Performant.
   ============================================================ */

import content from './content.js';

(() => {
  'use strict';

  /* ──────────────────────────────────────────────
     0a. DARK / LIGHT THEME
     ────────────────────────────────────────────── */
  const THEME_KEY = 'mc_theme';
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem(THEME_KEY);
  let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

  function applyTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀' : '☽';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ──────────────────────────────────────────────
     0b. LANGUAGE / i18n
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
     6. CHAPTER NAV HIGHLIGHTS
     ────────────────────────────────────────────── */
  const chapterLinks = document.querySelectorAll('.nav__chapter[data-for]');
  if (chapterLinks.length) {
    const chapterSections = document.querySelectorAll(
      'section[data-section="03"], section[data-section="04"], section[data-section="05"], section[data-section="06"], section[data-section="07"]'
    );

    const setActive = (sectionNum) => {
      chapterLinks.forEach(link => {
        link.classList.toggle('is-active', link.dataset.for === sectionNum);
      });
    };

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.dataset.section);
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -55% 0px' });

    chapterSections.forEach(s => chapterObserver.observe(s));

    // Clear active when scrolled back to top
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chapterLinks.forEach(l => l.classList.remove('is-active'));
        }
      });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) heroObserver.observe(heroSection);
  }

  /* ──────────────────────────────────────────────
     6b. SCROLL PROGRESS BAR
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
     7. CUSTOM CURSOR — dot + ring + click ripple
     ────────────────────────────────────────────── */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !prefersReducedMotion) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
      let mX = 0, mY = 0;
      let dX = 0, dY = 0;  // dot position
      let rX = 0, rY = 0;  // ring position
      let visible = false;
      const DOT_EASE  = 0.15;
      const RING_EASE = 0.065;

      document.addEventListener('mousemove', (e) => {
        mX = e.clientX; mY = e.clientY;
        if (!visible) {
          dot.classList.add('cursor-dot--visible');
          ring.classList.add('cursor-ring--visible');
          dot.classList.remove('cursor-dot--hidden');
          ring.classList.remove('cursor-ring--hidden');
          visible = true;
        }
      });

      document.addEventListener('mouseleave', () => {
        dot.classList.add('cursor-dot--hidden');
        ring.classList.add('cursor-ring--hidden');
        dot.classList.remove('cursor-dot--visible');
        ring.classList.remove('cursor-ring--visible');
        visible = false;
      });

      document.addEventListener('mouseenter', () => {
        dot.classList.add('cursor-dot--visible');
        ring.classList.add('cursor-ring--visible');
        dot.classList.remove('cursor-dot--hidden');
        ring.classList.remove('cursor-ring--hidden');
        visible = true;
      });

      // Click ripple — spawn element, auto-remove on animationend
      document.addEventListener('mousedown', () => {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = mX + 'px';
        ripple.style.top  = mY + 'px';
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      });

      // Hover states — shrink ring, grow dot slightly
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('cursor-dot--hover');
          ring.classList.add('cursor-ring--hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('cursor-dot--hover');
          ring.classList.remove('cursor-ring--hover');
        });
      });

      // RAF lerp loop — dot fast, ring lagging
      const tickCursor = () => {
        dX += (mX - dX) * DOT_EASE;
        dY += (mY - dY) * DOT_EASE;
        rX += (mX - rX) * RING_EASE;
        rY += (mY - rY) * RING_EASE;
        dot.style.transform  = `translate(${dX}px, ${dY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rX}px, ${rY}px) translate(-50%, -50%)`;
        requestAnimationFrame(tickCursor);
      };
      tickCursor();
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

  /* ──────────────────────────────────────────────
     10. MAGNETIC BUTTON (.contact__cv)
     ────────────────────────────────────────────── */
  if (isFinePointer && !prefersReducedMotion) {
    const magBtn = document.querySelector('.contact__cv');
    if (magBtn) {
      const STRENGTH = 0.35;
      const RADIUS   = 120;
      let mBtnX = 0, mBtnY = 0, btnActive = false;

      magBtn.addEventListener('mousemove', (e) => {
        const rect = magBtn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          mBtnX = dx * STRENGTH;
          mBtnY = dy * STRENGTH;
          btnActive = true;
        }
      });

      magBtn.addEventListener('mouseleave', () => {
        mBtnX = 0; mBtnY = 0;
        btnActive = false;
        magBtn.style.transform = '';
      });

      const tickMagnet = () => {
        if (btnActive) {
          magBtn.style.transform = `translate(${mBtnX}px, ${mBtnY}px)`;
        }
        requestAnimationFrame(tickMagnet);
      };
      tickMagnet();
    }
  }

  /* ──────────────────────────────────────────────
     11. HERO MOUSE PARALLAX
         title/caption layer shifts subtly with mouse
     ────────────────────────────────────────────── */
  if (isFinePointer && !prefersReducedMotion) {
    const heroLeft = document.querySelector('.hero__left');
    const hero     = document.querySelector('.hero');

    if (heroLeft && hero) {
      let pX = 0, pY = 0;
      let tX = 0, tY = 0;
      const PARA_EASE = 0.055;
      const DEPTH = 14; // max px shift

      document.addEventListener('mousemove', (e) => {
        // Only activate while within hero vertical bounds
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        // Normalise -1 → +1 from viewport centre
        pX = (e.clientX / window.innerWidth  - 0.5) * 2;
        pY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      const tickParallax = () => {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          tX += (pX * DEPTH - tX) * PARA_EASE;
          tY += (pY * DEPTH - tY) * PARA_EASE;
          heroLeft.style.transform = `translate(${tX}px, ${tY}px)`;
        }
        requestAnimationFrame(tickParallax);
      };
      tickParallax();
    }
  }

})();

/* ──────────────────────────────────────────────────────────────────
   LATEST BLOG POSTS — homepage section
   Fetches the 3 most recent posts from Sanity CDN at runtime.
   Uses the same bl-card system as the blog listing page.
   Hides the section entirely if there are no posts yet.
   ────────────────────────────────────────────────────────────────── */
(async () => {
  const PROJECT_ID = 'p4gxllem';
  const DATASET    = 'production';
  const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

  const section = document.getElementById('latest-posts');
  const grid    = document.getElementById('latest-posts-grid');
  if (!section || !grid) return;

  function imgUrl(ref, w = 800) {
    if (!ref) return null;
    const parts = ref.replace('image-', '').split('-');
    const ext = parts.pop(); const id = parts.join('-');
    return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format&fit=crop&sat=-5`;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function readTime(body = []) {
    let w = 0;
    body.forEach(b => b._type === 'block' && b.children?.forEach(s => { if (s.text) w += s.text.split(/\s+/).filter(Boolean).length; }));
    return Math.max(1, Math.ceil(w / 238));
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const CAT = { ecommerce: 'E-Commerce', ai: 'AI', market: 'Market', opinion: 'Opinion', strategy: 'Strategy' };

  try {
    const q = encodeURIComponent(
      `*[_type=="post"]|order(publishedAt desc)[0..2]{_id,title,slug,publishedAt,category,coverImage{asset,alt},body}`
    );
    const res   = await fetch(`${CDN}?query=${q}`);
    const posts = (await res.json()).result || [];

    if (!posts.length) return; // stay hidden

    grid.innerHTML = posts.map(p => {
      const url  = imgUrl(p.coverImage?.asset?._ref, 800);
      const slug = p.slug?.current || '';
      const cat  = CAT[p.category] || p.category || '';
      const mins = readTime(p.body);
      return `
        <a href="/post?slug=${encodeURIComponent(slug)}" class="bl-card bl-card--small">
          <div class="bl-card__bg" ${url ? `style="background-image:url('${url}')"` : ''}></div>
          <div class="bl-card__overlay"></div>
          <div class="bl-card__content">
            <div class="bl-card__top">
              ${cat ? `<span class="bl-tag">${esc(cat)}</span>` : ''}
            </div>
            <div class="bl-card__bottom">
              <h3 class="bl-card__title">${esc(p.title || '')}</h3>
              <div class="bl-card__meta">
                <span>${fmtDate(p.publishedAt)}</span>
                <span class="bl-card__dot">·</span>
                <span>${mins} min read</span>
              </div>
              <div class="bl-card__arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.086 7.5L11.404 4.818 12.11 4.11 16 8l-3.89 3.89-.707-.707L14.086 8.5H0v-1h14.086z"/></svg></div>
            </div>
          </div>
        </a>`;
    }).join('');

    section.hidden = false;

  } catch (e) {
    // Fail silently — section stays hidden
    console.warn('[latest-posts]', e.message);
  }
})();
