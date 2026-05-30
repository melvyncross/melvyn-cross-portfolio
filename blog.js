/**
 * blog.js — The Dispatch: blog listing page
 * Alec-template-inspired editorial design.
 */

// ── Page chrome hydration (hero title + description from Sanity) ─────────────
import content from './content.js';

function applyChrome(lang) {
  const s = content[lang] || content['en'];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (s[key] != null && s[key] !== '') el.innerHTML = s[key];
  });

  // Editorial section + label
  const ed = document.getElementById('bl-editorial');
  if (ed && s.bl_editorial) ed.innerHTML = s.bl_editorial;
  const edLabel = document.getElementById('bl-editorial-label');
  if (edLabel) edLabel.textContent = lang === 'fr' ? 'Pourquoi j’écris ces articles' : 'Why I write this';
}

let chromeLang = localStorage.getItem('mc_lang') || 'en';
applyChrome(chromeLang);

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  chromeLang = chromeLang === 'en' ? 'fr' : 'en';
  applyChrome(chromeLang);
});

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
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format&fit=crop`;
}
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
}
function readTime(body) {
  if (!Array.isArray(body)) return 1;
  let w=0;
  body.forEach(b=>b._type==='block'&&b.children?.forEach(s=>{if(s.text)w+=s.text.split(/\s+/).filter(Boolean).length;}));
  return Math.max(1,Math.ceil(w/238));
}
const CAT = {ecommerce:'E-Commerce',ai:'AI',market:'Market',opinion:'Opinion',strategy:'Strategy'};

// ── render a card ─────────────────────────────────────────────────────────────
function card(p, size='small', lang='en') {
  const url   = imgUrl(p.coverImage?.asset?._ref, size==='featured' ? 1400 : 800);
  const slug  = p.slug?.current||'';
  const cat   = CAT[p.category]||p.category||'';
  const mins  = readTime(p.body);
  const title = (lang==='fr' && p.title_fr) ? p.title_fr : (p.title||'');
  const cta   = lang==='fr' ? 'Lire l\'article →' : 'Read story →';

  return `
    <a href="/post?slug=${encodeURIComponent(slug)}" class="bl-card bl-card--${size}">
      <div class="bl-card__bg" ${url?`style="background-image:url('${url}')"`:''}></div>
      <div class="bl-card__overlay"></div>
      <div class="bl-card__content">
        <div class="bl-card__top">
          ${cat ? `<span class="bl-tag">${esc(cat)}</span>` : ''}
        </div>
        <div class="bl-card__bottom">
          <h${size==='featured'?'2':'3'} class="bl-card__title">${esc(title)}</h${size==='featured'?'2':'3'}>
          <div class="bl-card__meta">
            <span>${fmtDate(p.publishedAt)}</span>
            <span class="bl-card__dot">·</span>
            <span>${mins} min read</span>
          </div>
          ${size==='small' ? '<div class="bl-card__arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.086 7.5L11.404 4.818 12.11 4.11 16 8l-3.89 3.89-.707-.707L14.086 8.5H0v-1h14.086z"/></svg></div>' : `<div class="bl-card__cta">${cta}</div>`}
        </div>
      </div>
    </a>
  `;
}

// ── fetch ─────────────────────────────────────────────────────────────────────
async function fetchPosts() {
  const q = encodeURIComponent(`*[_type=="post"]|order(publishedAt desc){_id,title,title_fr,slug,publishedAt,category,excerpt,excerpt_fr,coverImage{asset,alt},body}`);
  const r = await fetch(`${CDN}?query=${q}`);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).result||[];
}

// ── demo cards (shown when no Sanity content exists yet) ──────────────────────
const DEMO_COVERS = [
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=70&sat=-15',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=70&sat=-15',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&auto=format&fit=crop&q=70&sat=-15',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=70&sat=-15',
];
const DEMO_POSTS = [
  {slug:'__demo__',category:'ecommerce',title:'Lorem Ipsum: E-Commerce & the Future of Digital Retail',publishedAt:'2026-05-26T09:00:00Z',mins:7,cover:DEMO_COVERS[0]},
  {slug:'__demo__',category:'ai',title:'Dolor Sit Amet: How AI Is Reshaping the Market',publishedAt:'2026-05-20T09:00:00Z',mins:5,cover:DEMO_COVERS[1]},
  {slug:'__demo__',category:'strategy',title:'Consectetur Adipiscing: Strategy in Uncertain Times',publishedAt:'2026-05-14T09:00:00Z',mins:4,cover:DEMO_COVERS[2]},
  {slug:'__demo__',category:'market',title:'Sed Do Eiusmod: Reading the Market Before It Moves',publishedAt:'2026-05-08T09:00:00Z',mins:6,cover:DEMO_COVERS[3]},
];
const CAT_LABEL = {ecommerce:'E-Commerce',ai:'AI',market:'Market',opinion:'Opinion',strategy:'Strategy'};

function demoCard(p, size='small', delay='0s') {
  const cat = CAT_LABEL[p.category]||p.category||'';
  const date = new Date(p.publishedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const revealAttr = size==='small' ? `bl-reveal" style="--bl-delay:${delay}` : '';
  return `
    <a href="/post?slug=${encodeURIComponent(p.slug)}" class="bl-card bl-card--${size} ${revealAttr}">
      <div class="bl-card__bg" style="background-image:url('${p.cover}')"></div>
      <div class="bl-card__overlay"></div>
      <div class="bl-card__content">
        <div class="bl-card__top">
          ${cat?`<span class="bl-tag">${esc(cat)}</span>`:''}
          <span class="bl-demo-badge">Preview</span>
        </div>
        <div class="bl-card__bottom">
          <h${size==='featured'?'2':'3'} class="bl-card__title">${esc(p.title)}</h${size==='featured'?'2':'3'}>
          <div class="bl-card__meta"><span>${date}</span><span class="bl-card__dot">·</span><span>${p.mins} min read</span></div>
          ${size==='small'?'<div class="bl-card__arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.086 7.5L11.404 4.818 12.11 4.11 16 8l-3.89 3.89-.707-.707L14.086 8.5H0v-1h14.086z"/></svg></div>':'<div class="bl-card__cta">Read preview →</div>'}
        </div>
      </div>
    </a>`;
}

// ── theme ─────────────────────────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const set = t => { document.documentElement.setAttribute('data-theme',t); btn.textContent=t==='dark'?'☀':'☽'; localStorage.setItem('mc_theme',t); };
  set(document.documentElement.getAttribute('data-theme')||'light');
  btn.addEventListener('click',()=>set(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
}

// ── custom cursor ─────────────────────────────────────────────────────────────
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let mX=0,mY=0,dX=0,dY=0,rX=0,rY=0,visible=false;
  document.addEventListener('mousemove', e => {
    mX=e.clientX; mY=e.clientY;
    if (!visible) { dot.classList.add('cursor-dot--visible'); ring.classList.add('cursor-ring--visible'); visible=true; }
  });
  document.addEventListener('mouseleave', () => { dot.classList.add('cursor-dot--hidden'); ring.classList.add('cursor-ring--hidden'); dot.classList.remove('cursor-dot--visible'); ring.classList.remove('cursor-ring--visible'); visible=false; });
  document.addEventListener('mouseenter', () => { dot.classList.add('cursor-dot--visible'); ring.classList.add('cursor-ring--visible'); dot.classList.remove('cursor-dot--hidden'); ring.classList.remove('cursor-ring--hidden'); visible=true; });
  document.addEventListener('mousedown', () => {
    const r=document.createElement('div'); r.className='cursor-ripple'; r.style.left=mX+'px'; r.style.top=mY+'px';
    document.body.appendChild(r); r.addEventListener('animationend',()=>r.remove(),{once:true});
  });
  const addHover = () => document.querySelectorAll('a,button,[role="button"]').forEach(el => {
    el.addEventListener('mouseenter',()=>{ dot.classList.add('cursor-dot--hover'); ring.classList.add('cursor-ring--hover'); });
    el.addEventListener('mouseleave',()=>{ dot.classList.remove('cursor-dot--hover'); ring.classList.remove('cursor-ring--hover'); });
  });
  addHover();
  const tick=()=>{ dX+=(mX-dX)*0.15; dY+=(mY-dY)*0.15; rX+=(mX-rX)*0.065; rY+=(mY-rY)*0.065; dot.style.transform=`translate(${dX}px,${dY}px) translate(-50%,-50%)`; ring.style.transform=`translate(${rX}px,${rY}px) translate(-50%,-50%)`; requestAnimationFrame(tick); };
  tick();
  // Re-bind hover after dynamic content is rendered
  return addHover;
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

// ── render cards for a given language ────────────────────────────────────────
function renderCards(posts, lang, rebindHover) {
  const featEl = document.querySelector('.bl-card--featured');
  const grid   = document.getElementById('bl-grid');
  if (!featEl || !posts.length) return;

  // Replace featured card in place
  featEl.outerHTML = card(posts[0], 'featured', lang);

  // Replace grid cards
  if (posts.length > 1 && grid) {
    grid.innerHTML = posts.slice(1).map((p, i) => {
      const delay = `${(i % 3) * 0.1}s`;
      return card(p, 'small', lang).replace(
        `class="bl-card bl-card--small"`,
        `class="bl-card bl-card--small bl-reveal is-visible" style="--bl-delay:${delay}"`
      );
    }).join('');
  }
  if (rebindHover) rebindHover();
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  initTheme();
  const rebindHover = initCursor();

  const skeleton  = document.getElementById('bl-skeleton');
  const grid      = document.getElementById('bl-grid');
  const empty     = document.getElementById('bl-empty');
  const error     = document.getElementById('bl-error');
  const featCard  = document.getElementById('bl-featured-card');

  let cardLang = localStorage.getItem('mc_lang') || 'en';

  try {
    const posts = await fetchPosts();
    skeleton.hidden = true;

    if (!posts.length) {
      // No real posts yet — show demo preview cards so the design is visible
      featCard.outerHTML = demoCard(DEMO_POSTS[0], 'featured');
      grid.innerHTML = DEMO_POSTS.slice(1).map((p,i)=>demoCard(p,'small',`${(i%3)*0.1}s`)).join('');
      grid.hidden = false;
      requestAnimationFrame(initReveal);
      if (rebindHover) rebindHover();
      return;
    }

    // Initial render
    featCard.outerHTML = card(posts[0], 'featured', cardLang);
    if (posts.length > 1) {
      grid.innerHTML = posts.slice(1).map((p, i) => {
        const delay = `${(i % 3) * 0.1}s`;
        return card(p, 'small', cardLang).replace(
          `class="bl-card bl-card--small"`,
          `class="bl-card bl-card--small bl-reveal" style="--bl-delay:${delay}"`
        );
      }).join('');
      grid.hidden = false;
    }
    requestAnimationFrame(initReveal);
    if (rebindHover) rebindHover();

    // Re-render cards on lang toggle
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
      cardLang = cardLang === 'en' ? 'fr' : 'en';
      renderCards(posts, cardLang, rebindHover);
    });

  } catch(e) {
    console.error('[blog]',e);
    skeleton.hidden = true;
    // Sanity unreachable — fall back to demo cards so the design is still visible
    featCard.outerHTML = demoCard(DEMO_POSTS[0], 'featured');
    grid.innerHTML = DEMO_POSTS.slice(1).map((p,i)=>demoCard(p,'small',`${(i%3)*0.1}s`)).join('');
    grid.hidden = false;
    requestAnimationFrame(initReveal);
    if (rebindHover) rebindHover();
  }
}

main();
