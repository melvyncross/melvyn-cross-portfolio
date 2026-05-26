/**
 * blog.js — The Dispatch: blog listing page
 * Alec-template-inspired editorial design.
 */

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

// ── helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function imgUrl(ref, w=1200) {
  if (!ref) return null;
  const parts = ref.replace('image-','').split('-');
  const ext = parts.pop(); const id = parts.join('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format&fit=crop&sat=-5`;
}
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
}
function readTime(body=[]) {
  let w=0;
  body.forEach(b=>b._type==='block'&&b.children?.forEach(s=>{if(s.text)w+=s.text.split(/\s+/).filter(Boolean).length;}));
  return Math.max(1,Math.ceil(w/238));
}
const CAT = {ecommerce:'E-Commerce',ai:'AI',market:'Market',opinion:'Opinion',strategy:'Strategy'};

// ── render a card ─────────────────────────────────────────────────────────────
function card(p, size='small') {
  const url  = imgUrl(p.coverImage?.asset?._ref, size==='featured' ? 1400 : 800);
  const slug = p.slug?.current||'';
  const cat  = CAT[p.category]||p.category||'';
  const mins = readTime(p.body);

  return `
    <a href="/post?slug=${encodeURIComponent(slug)}" class="bl-card bl-card--${size}">
      <div class="bl-card__bg" ${url?`style="background-image:url('${url}')"`:''}></div>
      <div class="bl-card__overlay"></div>
      <div class="bl-card__content">
        <div class="bl-card__top">
          ${cat ? `<span class="bl-tag">${esc(cat)}</span>` : ''}
        </div>
        <div class="bl-card__bottom">
          <h${size==='featured'?'2':'3'} class="bl-card__title">${esc(p.title||'')}</h${size==='featured'?'2':'3'}>
          <div class="bl-card__meta">
            <span>${fmtDate(p.publishedAt)}</span>
            <span class="bl-card__dot">·</span>
            <span>${mins} min read</span>
          </div>
          ${size==='small' ? '<div class="bl-card__arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.086 7.5L11.404 4.818 12.11 4.11 16 8l-3.89 3.89-.707-.707L14.086 8.5H0v-1h14.086z"/></svg></div>' : '<div class="bl-card__cta">Read story →</div>'}
        </div>
      </div>
    </a>
  `;
}

// ── fetch ─────────────────────────────────────────────────────────────────────
async function fetchPosts() {
  const q = encodeURIComponent(`*[_type=="post"]|order(publishedAt desc){_id,title,slug,publishedAt,category,excerpt,coverImage{asset,alt},body}`);
  const r = await fetch(`${CDN}?query=${q}`);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).result||[];
}

// ── theme ─────────────────────────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const set = t => { document.documentElement.setAttribute('data-theme',t); btn.textContent=t==='dark'?'☀':'☽'; localStorage.setItem('mc_theme',t); };
  set(document.documentElement.getAttribute('data-theme')||'light');
  btn.addEventListener('click',()=>set(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
}

// ── scroll reveal ─────────────────────────────────────────────────────────────
function initReveal() {
  const items = document.querySelectorAll('.bl-reveal');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  items.forEach(el => obs.observe(el));
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  initTheme();

  const skeleton  = document.getElementById('bl-skeleton');
  const grid      = document.getElementById('bl-grid');
  const empty     = document.getElementById('bl-empty');
  const error     = document.getElementById('bl-error');
  const featCard  = document.getElementById('bl-featured-card');

  try {
    const posts = await fetchPosts();
    skeleton.hidden = true;

    if (!posts.length) { empty.hidden=false; featCard.outerHTML='<div class="bl-card bl-card--featured bl-card--empty"></div>'; return; }

    // Featured = first post (animate in via CSS)
    featCard.outerHTML = card(posts[0], 'featured');

    // Rest in grid — staggered scroll reveal
    if (posts.length > 1) {
      grid.innerHTML = posts.slice(1).map((p, i) => {
        const delay = `${(i % 3) * 0.1}s`; // stagger within each row
        return card(p, 'small').replace(
          `class="bl-card bl-card--small"`,
          `class="bl-card bl-card--small bl-reveal" style="--bl-delay:${delay}"`
        );
      }).join('');
      grid.hidden = false;
    }

    requestAnimationFrame(initReveal);

  } catch(e) {
    console.error('[blog]',e);
    skeleton.hidden = true;
    error.hidden = false;
    featCard.outerHTML='<div class="bl-card bl-card--featured bl-card--empty"></div>';
  }
}

main();
