/**
 * books.js — Reading List page
 * Fetches books from Sanity at runtime and renders the card grid.
 */

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function imgUrl(ref, w = 400) {
  if (!ref) return null;
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id  = parts.join('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format`;
}

const CAT = {
  finance:     'Personal Finance',
  development: 'Personal Development',
  business:    'Business',
  mindset:     'Mindset',
  other:       'Other',
};

function renderCard(b) {
  const cover  = imgUrl(b.coverImage?.asset?._ref, 500);
  const cat    = CAT[b.category] || b.category || '';
  const rating = b.rating != null ? b.rating : null;
  const link   = b.amazonUrl || '#';

  const thoughtsHtml = b.myThoughts
    ? `<p class="bk-card__thoughts">&ldquo;${esc(b.myThoughts)}&rdquo;</p>`
    : '';

  const learnedHtml = b.whatILearned?.length
    ? `<hr class="bk-card__divider">
       <div class="bk-card__learned">
         <p class="bk-card__learned-label">What I Learned</p>
         <ul class="bk-card__learned-list">
           ${b.whatILearned.map(item => `<li>${esc(item)}</li>`).join('')}
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
               Buy on Amazon →
             </a>`
          : ''}
      </div>
    </div>`;
}

async function load() {
  const grid     = document.getElementById('bk-grid');
  const skeleton = document.getElementById('bk-skeleton');
  const countEl  = document.getElementById('bk-count');
  if (!grid) return;

  const query = encodeURIComponent(`
    *[_type == "book"] | order(featured desc, _createdAt desc) {
      _id, title, author, coverImage, amazonUrl,
      rating, category, myThoughts, whatILearned, featured, readAt
    }
  `);

  try {
    const res            = await fetch(`${CDN}?query=${query}`);
    const { result: books } = await res.json();

    if (skeleton) skeleton.remove();

    if (!books?.length) {
      grid.innerHTML = `<div class="bk-empty">
        <p class="bk-empty__title">More books coming soon.</p>
      </div>`;
      return;
    }

    grid.innerHTML = books.map(renderCard).join('');

    // Update live count in hero strip
    if (countEl) countEl.textContent = books.length;

  } catch (err) {
    console.error('[books.js]', err);
    if (skeleton) skeleton.remove();
    grid.innerHTML = `<div class="bk-empty">
      <p class="bk-empty__title">Could not load books right now.</p>
    </div>`;
  }
}

load();
