/**
 * books.js — Reading List page
 * Fetches books from Sanity at runtime and renders the card grid.
 * Supports EN/FR language toggle.
 */

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

// ── Static page strings (EN / FR) ──────────────────────────────────────────
const STRINGS = {
  en: {
    hero_pre:    'My reading list',
    hero_title:  "Books I've <em>Read</em>.",
    hero_desc:   'Personal finance, mindset, business — books that genuinely changed how I think about money, strategy, and building something of my own.',
    stat_read:   'Books read',
    stat_cat:    'Categories',
    stat_max:    'Max rating',
    learned:     'What I Learned',
    buy:         'Buy on Amazon →',
  },
  fr: {
    hero_pre:    'Mes lectures',
    hero_title:  "Les livres que j'ai <em>Lus</em>.",
    hero_desc:   'Finance personnelle, état d\'esprit, business — des livres qui ont vraiment changé ma façon de penser l\'argent, la stratégie et le fait de construire quelque chose.',
    stat_read:   'Livres lus',
    stat_cat:    'Catégories',
    stat_max:    'Note max',
    learned:     'Ce que j\'ai appris',
    buy:         'Acheter sur Amazon →',
  },
};

// ── Category labels ─────────────────────────────────────────────────────────
const CAT = {
  en: {
    finance:     'Personal Finance',
    development: 'Personal Development',
    business:    'Business',
    mindset:     'Mindset',
    other:       'Other',
  },
  fr: {
    finance:     'Finance personnelle',
    development: 'Développement personnel',
    business:    'Business',
    mindset:     'Mentalité',
    other:       'Autre',
  },
};

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function imgUrl(ref, w = 600) {
  if (!ref) return null;
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id  = parts.join('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format`;
}

// ── Render a single book card ───────────────────────────────────────────────
function renderCard(b, lang) {
  const cover   = imgUrl(b.coverImage?.asset?._ref, 600);
  const catKey  = b.category || 'other';
  const cat     = CAT[lang][catKey] || CAT.en[catKey] || catKey;
  const rating  = b.rating != null ? b.rating : null;
  const link    = b.amazonUrl || '#';
  const s       = STRINGS[lang];

  // Pick FR content if available, fall back to EN
  const thoughts = (lang === 'fr' && b.myThoughts_fr) ? b.myThoughts_fr : b.myThoughts;
  const learned  = (lang === 'fr' && b.whatILearned_fr?.length) ? b.whatILearned_fr : b.whatILearned;

  const thoughtsHtml = thoughts
    ? `<p class="bk-card__thoughts">&ldquo;${esc(thoughts)}&rdquo;</p>`
    : '';

  const learnedHtml = learned?.length
    ? `<hr class="bk-card__divider">
       <div class="bk-card__learned">
         <p class="bk-card__learned-label">${s.learned}</p>
         <ul class="bk-card__learned-list">
           ${learned.map(item => `<li>${esc(item)}</li>`).join('')}
         </ul>
       </div>`
    : '';

  return `
    <div class="bk-card${b.featured ? ' bk-card--featured' : ''}">
      <a href="${esc(link)}" target="_blank" rel="noopener noreferrer"
         class="bk-card__cover-link" aria-label="View ${esc(b.title)} on Amazon">
        <div class="bk-card__cover-wrap">
          ${cover
            ? `<img src="${cover}" alt="Cover — ${esc(b.title)}" class="bk-card__cover" loading="lazy">`
            : `<div class="bk-card__cover-fallback"><span>No cover</span></div>`}
        </div>
      </a>
      <div class="bk-card__body">
        <div class="bk-card__meta">
          ${cat    ? `<span class="bk-card__category">${esc(cat)}</span>` : '<span></span>'}
          ${rating !== null
            ? `<div class="bk-card__rating" title="${rating} out of 10">
                 <span class="bk-card__rating-num">${rating}</span><span class="bk-card__rating-denom">/10</span>
               </div>`
            : ''}
        </div>
        <h2 class="bk-card__title">${esc(b.title)}</h2>
        <p class="bk-card__author">by ${esc(b.author)}</p>
        ${thoughtsHtml}
        ${learnedHtml}
        ${link !== '#'
          ? `<a href="${esc(link)}" target="_blank" rel="noopener noreferrer" class="bk-card__buy">
               ${s.buy}
             </a>`
          : ''}
      </div>
    </div>`;
}

// ── Apply static page strings for the chosen language ──────────────────────
function applyStaticLang(lang) {
  const s = STRINGS[lang] || STRINGS.en;
  const set = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  set('bk-hero-pre',   s.hero_pre);
  set('bk-hero-title', s.hero_title);
  set('bk-hero-desc',  s.hero_desc);
  set('bk-stat-read',  s.stat_read);
  set('bk-stat-cat',   s.stat_cat);
  set('bk-stat-max',   s.stat_max);
}

// ── Rebind custom cursor hover on dynamically added elements ───────────────
function rebindCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  document.querySelectorAll('.bk-grid a, .bk-grid button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor-dot--hover');
      ring.classList.add('cursor-ring--hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-dot--hover');
      ring.classList.remove('cursor-ring--hover');
    });
  });
}

// ── Load books from Sanity ──────────────────────────────────────────────────
async function load() {
  const grid     = document.getElementById('bk-grid');
  const skeleton = document.getElementById('bk-skeleton');
  const countEl  = document.getElementById('bk-count');
  if (!grid) return;

  const query = encodeURIComponent(`
    *[_type == "book"] | order(featured desc, _createdAt desc) {
      _id, title, author, coverImage, amazonUrl,
      rating, category, myThoughts, myThoughts_fr,
      whatILearned, whatILearned_fr, featured, readAt
    }
  `);

  let books = [];
  try {
    const res = await fetch(`${CDN}?query=${query}`);
    const { result } = await res.json();
    books = result || [];

    if (skeleton) skeleton.remove();

    if (!books.length) {
      grid.innerHTML = `<div class="bk-empty">
        <p class="bk-empty__title">More books coming soon.</p>
      </div>`;
      return;
    }

    if (countEl) countEl.textContent = books.length;

  } catch (err) {
    console.error('[books.js]', err);
    if (skeleton) skeleton.remove();
    grid.innerHTML = `<div class="bk-empty">
      <p class="bk-empty__title">Could not load books right now.</p>
    </div>`;
    return;
  }

  // ── Initial render in stored language ──────────────────────────────────
  let currentLang = localStorage.getItem('mc_lang') || 'en';
  applyStaticLang(currentLang);
  grid.innerHTML = books.map(b => renderCard(b, currentLang)).join('');
  rebindCursor();

  // ── Language toggle ─────────────────────────────────────────────────────
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = localStorage.getItem('mc_lang') || 'en';
      applyStaticLang(currentLang);
      grid.innerHTML = books.map(b => renderCard(b, currentLang)).join('');
      rebindCursor();
    });
  }
}

load();
