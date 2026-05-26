/**
 * blog.js — Blog listing page
 * Fetches all published posts from Sanity CDN and renders the grid.
 * No build step — pure ESM, runs in the browser.
 */

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const API_VER    = '2024-01-01';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VER}/data/query/${DATASET}`;

// ── Sanity image URL helper ───────────────────────────────────────────────────
function sanityImageUrl(ref, width = 800) {
  if (!ref) return null;
  // ref format: "image-<id>-<dims>-<ext>"
  const [, id, dims, ext] = ref.split('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}?w=${width}&auto=format`;
}

// ── Read time estimate ────────────────────────────────────────────────────────
function estimateReadTime(body = []) {
  let words = 0;
  body.forEach(block => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      block.children.forEach(span => {
        if (span.text) words += span.text.split(/\s+/).filter(Boolean).length;
      });
    }
  });
  return Math.max(1, Math.ceil(words / 238));
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── Category label ────────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  ecommerce: 'E-Commerce',
  ai: 'AI',
  market: 'Market',
  opinion: 'Opinion',
  strategy: 'Strategy',
};

// ── Render a post card ────────────────────────────────────────────────────────
function renderCard(post) {
  const imgRef  = post.coverImage?.asset?._ref;
  const imgUrl  = sanityImageUrl(imgRef, 800);
  const readMin = estimateReadTime(post.body);
  const catLabel = CATEGORY_LABELS[post.category] || post.category || '';
  const date    = formatDate(post.publishedAt);
  const slug    = post.slug?.current || '';

  return `
    <article class="blog-card">
      <a href="/post?slug=${encodeURIComponent(slug)}" class="blog-card__link" aria-label="${escHtml(post.title)}">
        <div class="blog-card__img-wrap">
          ${imgUrl
            ? `<img class="blog-card__img" src="${imgUrl}" alt="${escHtml(post.coverImage?.alt || post.title)}" loading="lazy" />`
            : `<div class="blog-card__img-placeholder"></div>`}
        </div>
        <div class="blog-card__body">
          <div class="blog-card__meta">
            ${catLabel ? `<span class="blog-card__cat">${escHtml(catLabel)}</span>` : ''}
            <span class="blog-card__date">${date}</span>
            <span class="blog-card__read">${readMin} min read</span>
          </div>
          <h2 class="blog-card__title">${escHtml(post.title)}</h2>
          <p class="blog-card__excerpt">${escHtml(post.excerpt || '')}</p>
          <span class="blog-card__cta">Read →</span>
        </div>
      </a>
    </article>
  `;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Fetch posts from Sanity CDN ───────────────────────────────────────────────
async function fetchPosts() {
  const query = encodeURIComponent(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, category, tags, excerpt,
      coverImage { asset, alt },
      body, featured
    }`
  );
  const res = await fetch(`${CDN}?query=${query}`);
  if (!res.ok) throw new Error(`Sanity CDN error: ${res.status}`);
  const data = await res.json();
  return data.result || [];
}

// ── Dark mode / theme ─────────────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const update = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☀' : '☽';
    localStorage.setItem('mc_theme', theme);
  };
  update(document.documentElement.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    update(next);
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  initTheme();

  const skeleton = document.getElementById('blog-skeleton');
  const grid     = document.getElementById('blog-posts');
  const empty    = document.getElementById('blog-empty');
  const error    = document.getElementById('blog-error');

  try {
    const posts = await fetchPosts();

    skeleton.hidden = true;

    if (!posts.length) {
      empty.hidden = false;
      return;
    }

    grid.innerHTML = posts.map(renderCard).join('');
    grid.hidden = false;

  } catch (err) {
    console.error('[blog.js]', err);
    skeleton.hidden = true;
    error.hidden = false;
  }
}

main();
