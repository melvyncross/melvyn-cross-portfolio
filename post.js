/**
 * post.js — The Dispatch: single post page
 * Alec-template-inspired split hero + centred body.
 *
 * Features: scroll progress, breadcrumb, TOC + active section,
 * social sharing (X, LinkedIn, copy-link), prev/next, more-posts,
 * JSON-LD, OG meta, Portable Text renderer.
 */

let _rebindCursorHover = null; // set after initCursor(), called after DOM updates

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug = t => t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '';
const CAT = {ecommerce:'E-Commerce',ai:'Artificial Intelligence',market:'Market Insights',opinion:'Opinion',strategy:'Strategy'};

function imgUrl(ref, w=1400) {
  if (!ref) return null;
  const parts = ref.replace('image-','').split('-');
  const ext = parts.pop(); const id = parts.join('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format&fit=crop`;
}

function readTime(body=[]) {
  let w=0;
  body.forEach(b=>b._type==='block'&&b.children?.forEach(s=>{if(s.text)w+=s.text.split(/\s+/).filter(Boolean).length;}));
  return Math.max(1,Math.ceil(w/238));
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT → HTML
// ─────────────────────────────────────────────────────────────────────────────
let _tocEntries = [];

function renderMark(mark, text, defs) {
  if (mark==='strong') return `<strong>${text}</strong>`;
  if (mark==='em')     return `<em>${text}</em>`;
  if (mark==='code')   return `<code>${text}</code>`;
  const ann = defs?.find(a=>a._key===mark);
  if (ann?.href||ann?._type==='link') {
    const href=ann.href||'#', blank=ann.blank!==false;
    return `<a href="${esc(href)}"${blank?' target="_blank" rel="noopener noreferrer"':''}>${text}</a>`;
  }
  return text;
}

function renderSpans(children=[], markDefs=[]) {
  return children.map(span=>{
    if (span._type!=='span') return '';
    let t=esc(span.text||'');
    [...(span.marks||[])].reverse().forEach(m=>{ t=renderMark(m,t,markDefs); });
    return t;
  }).join('');
}

function renderBlock(block) {
  if (block._type==='image') {
    const url=imgUrl(block.asset?._ref,1200);
    if (!url) return '';
    const cap=block.caption?`<figcaption class="pt-img__cap">${esc(block.caption)}</figcaption>`:'';
    return `<figure class="pt-img"><img src="${url}" alt="${esc(block.alt||'')}" loading="lazy">${cap}</figure>`;
  }
  if (block._type!=='block') return '';
  const inner=renderSpans(block.children,block.markDefs);
  const st=block.style||'normal';

  if (block.listItem) return {_li:block.listItem,html:`<li>${inner}</li>`};

  if (st==='h2') {
    const id=slug(block.children?.map(s=>s.text).join('')||'');
    _tocEntries.push({level:2,id,text:block.children?.map(s=>s.text).join('')||''});
    return `<h2 id="${id}">${inner}</h2>`;
  }
  if (st==='h3') {
    const id=slug(block.children?.map(s=>s.text).join('')||'');
    _tocEntries.push({level:3,id,text:block.children?.map(s=>s.text).join('')||''});
    return `<h3 id="${id}">${inner}</h3>`;
  }
  if (st==='h4') return `<h4>${inner}</h4>`;
  if (st==='blockquote') return `<blockquote><p>${inner}</p></blockquote>`;
  return `<p>${inner}</p>`;
}

function renderBody(blocks=[]) {
  _tocEntries=[];
  const parts=[]; let list=null,listType=null;
  const flush=()=>{ if(list){const t=listType==='bullet'?'ul':'ol'; parts.push(`<${t}>${list.join('')}</${t}>`); list=null;listType=null;} };
  blocks.forEach(b=>{
    const r=renderBlock(b);
    if(r&&typeof r==='object'&&r._li){
      if(listType!==r._li){flush();list=[];listType=r._li;}
      list.push(r.html);
    } else { flush(); if(r) parts.push(r); }
  });
  flush();
  return parts.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITY FETCHES
// ─────────────────────────────────────────────────────────────────────────────
async function fetchPost(slugVal) {
  const q=encodeURIComponent(`*[_type=="post"&&slug.current=="${slugVal}"][0]{_id,title,slug,publishedAt,category,tags,excerpt,coverImage{asset,alt},body[]{...,_type=="image"=>{...,asset->}},featured}`);
  const r=await fetch(`${CDN}?query=${q}`);
  if(!r.ok) throw new Error(r.status);
  return (await r.json()).result||null;
}

async function fetchAdjacent(publishedAt) {
  const [pr,nr]=await Promise.all([
    fetch(`${CDN}?query=${encodeURIComponent(`*[_type=="post"&&publishedAt<"${publishedAt}"]|order(publishedAt desc)[0]{title,slug}`)}`),
    fetch(`${CDN}?query=${encodeURIComponent(`*[_type=="post"&&publishedAt>"${publishedAt}"]|order(publishedAt asc)[0]{title,slug}`)}`),
  ]);
  return {prev:(await pr.json()).result||null,next:(await nr.json()).result||null};
}

async function fetchMore(currentSlug, publishedAt) {
  const q=encodeURIComponent(`*[_type=="post"&&slug.current!="${currentSlug}"]|order(publishedAt desc)[0..2]{_id,title,slug,publishedAt,category,coverImage{asset,alt},body}`);
  const r=await fetch(`${CDN}?query=${q}`);
  return (await r.json()).result||[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD RENDERER (reused from blog.js logic)
// ─────────────────────────────────────────────────────────────────────────────
function miniCard(p) {
  const url=imgUrl(p.coverImage?.asset?._ref,800);
  const slug_=p.slug?.current||'';
  const cat=CAT[p.category]||p.category||'';
  let w=0; (p.body||[]).forEach(b=>b._type==='block'&&b.children?.forEach(s=>{if(s.text)w+=s.text.split(/\s+/).filter(Boolean).length;}));
  const mins=Math.max(1,Math.ceil(w/238));
  return `<a href="/post?slug=${encodeURIComponent(slug_)}" class="bl-card bl-card--small">
    <div class="bl-card__bg" ${url?`style="background-image:url('${url}')"`:''}></div>
    <div class="bl-card__overlay"></div>
    <div class="bl-card__content">
      <div class="bl-card__top">${cat?`<span class="bl-tag">${esc(cat)}</span>`:''}</div>
      <div class="bl-card__bottom">
        <h3 class="bl-card__title">${esc(p.title||'')}</h3>
        <div class="bl-card__meta"><span>${fmtDate(p.publishedAt)}</span><span class="bl-card__dot">·</span><span>${mins} min read</span></div>
        <div class="bl-card__arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.086 7.5L11.404 4.818 12.11 4.11 16 8l-3.89 3.89-.707-.707L14.086 8.5H0v-1h14.086z"/></svg></div>
      </div>
    </div>
  </a>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────────────────────
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
  const bindHover = () => document.querySelectorAll('a,button,[role="button"]').forEach(el => {
    el.addEventListener('mouseenter',()=>{ dot.classList.add('cursor-dot--hover'); ring.classList.add('cursor-ring--hover'); });
    el.addEventListener('mouseleave',()=>{ dot.classList.remove('cursor-dot--hover'); ring.classList.remove('cursor-ring--hover'); });
  });
  bindHover();
  const tick=()=>{ dX+=(mX-dX)*0.15; dY+=(mY-dY)*0.15; rX+=(mX-rX)*0.065; rY+=(mY-rY)*0.065; dot.style.transform=`translate(${dX}px,${dY}px) translate(-50%,-50%)`; ring.style.transform=`translate(${rX}px,${rY}px) translate(-50%,-50%)`; requestAnimationFrame(tick); };
  tick();
  return bindHover;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
function initProgress() {
  const fill=document.getElementById('pt-progress-fill');
  if(!fill) return;
  const tick=()=>{
    const scrolled=window.scrollY, total=document.documentElement.scrollHeight-window.innerHeight;
    fill.style.width=(total>0?Math.min(100,scrolled/total*100):0)+'%';
  };
  window.addEventListener('scroll',tick,{passive:true}); tick();
}

// ─────────────────────────────────────────────────────────────────────────────
// COVER PARALLAX — image drifts slightly as user scrolls
// ─────────────────────────────────────────────────────────────────────────────
function initCoverParallax() {
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cover=document.getElementById('pt-cover');
  if(!cover) return;
  let raf=null;
  const update=()=>{
    const rect=cover.getBoundingClientRect();
    if(rect.bottom<0||rect.top>window.innerHeight){raf=null;return;}
    // progress 0 (cover top at viewport bottom) → 1 (cover bottom at viewport top)
    const prog=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
    const offset=Math.round((prog-0.5)*40); // ±20px shift
    cover.style.backgroundPositionY=`calc(50% + ${offset}px)`;
    raf=null;
  };
  window.addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(update); },{passive:true});
  update();
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE OF CONTENTS
// ─────────────────────────────────────────────────────────────────────────────
function buildTOC(entries) {
  const tocEl=document.getElementById('pt-toc');
  const listEl=document.getElementById('pt-toc-list');
  if(!listEl||!entries.length){if(tocEl)tocEl.hidden=true;return;}

  listEl.innerHTML=entries.map(({id,text,level})=>
    `<a href="#${id}" class="pt-toc__link pt-toc__link--h${level}" data-id="${id}">${esc(text)}</a>`
  ).join('');

  const links=[...listEl.querySelectorAll('.pt-toc__link')];
  const headings=entries.map(e=>document.getElementById(e.id)).filter(Boolean);

  const obs=new IntersectionObserver(evts=>{
    evts.forEach(ev=>{
      if(ev.isIntersecting) links.forEach(a=>a.classList.toggle('is-active',a.dataset.id===ev.target.id));
    });
  },{rootMargin:'0px 0px -65% 0px',threshold:0});
  headings.forEach(h=>obs.observe(h));

  listEl.addEventListener('click',e=>{
    const a=e.target.closest('.pt-toc__link');
    if(!a){return;}
    e.preventDefault();
    document.getElementById(a.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL SHARING
// ─────────────────────────────────────────────────────────────────────────────
function initSharing(title) {
  const url=window.location.href;
  document.getElementById('share-twitter')?.addEventListener('click',()=>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,'_blank','noopener'));
  document.getElementById('share-linkedin')?.addEventListener('click',()=>
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,'_blank','noopener'));
  const copyBtn=document.getElementById('share-copy');
  const copyLabel=document.getElementById('share-copy-label');
  copyBtn?.addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText(url);
      copyLabel.textContent='Copied!'; copyBtn.classList.add('is-copied');
      setTimeout(()=>{copyLabel.textContent='Copy'; copyBtn.classList.remove('is-copied');},2000);
    } catch { copyLabel.textContent='Failed'; setTimeout(()=>{copyLabel.textContent='Copy';},2000); }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// META INJECTION
// ─────────────────────────────────────────────────────────────────────────────
function injectMeta(post, canonicalUrl, ogImg) {
  document.title=`${post.title} — Melvyn Cross`;
  const set=(sel,val)=>{const el=document.querySelector(sel);if(el)el.setAttribute('content',val);};
  set('meta[name="description"]',post.excerpt||'');
  set('meta[property="og:url"]',canonicalUrl);
  set('meta[property="og:title"]',post.title);
  set('meta[property="og:description"]',post.excerpt||'');
  if(ogImg){set('meta[property="og:image"]',ogImg);set('meta[name="twitter:image"]',ogImg);}
  set('meta[name="twitter:title"]',post.title);
  set('meta[name="twitter:description"]',post.excerpt||'');
  document.getElementById('jsonld-article').textContent=JSON.stringify({
    '@context':'https://schema.org','@type':'Article',
    headline:post.title,description:post.excerpt||'',
    datePublished:post.publishedAt,
    author:{'@type':'Person',name:'Melvyn Cross',url:'https://melvyncross.com'},
    url:canonicalUrl,...(ogImg?{image:ogImg}:{})
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
function initTheme() {
  const btn=document.getElementById('theme-toggle');
  if(!btn) return;
  const set=t=>{document.documentElement.setAttribute('data-theme',t);btn.textContent=t==='dark'?'☀':'☽';localStorage.setItem('mc_theme',t);};
  set(document.documentElement.getAttribute('data-theme')||'light');
  btn.addEventListener('click',()=>set(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER POST
// ─────────────────────────────────────────────────────────────────────────────
function renderPost(post, adjacent, more) {
  const canonical=window.location.href;
  const coverRef=post.coverImage?.asset?._ref;
  const coverUrl=coverRef?imgUrl(coverRef,1400):null;
  const mins=readTime(post.body);
  const catLabel=CAT[post.category]||post.category||'';

  injectMeta(post, canonical, coverUrl||'');

  // Cover image
  const coverEl=document.getElementById('pt-cover');
  if(coverUrl&&coverEl) {
    coverEl.style.backgroundImage=`url('${coverUrl}')`;
    coverEl.style.backgroundSize='cover';
    coverEl.style.backgroundPosition='center';
  }

  // Breadcrumb title
  document.getElementById('pt-breadcrumb-title').textContent=post.title;

  // Category tag
  const catEl=document.getElementById('pt-cat');
  if(catEl&&catLabel){catEl.innerHTML=`<span class="bl-tag bl-tag--${post.category||'other'}">${esc(catLabel)}</span>`;}

  // Title
  document.getElementById('pt-title').textContent=post.title;

  // Date + read time
  const dateEl=document.getElementById('pt-date');
  dateEl.textContent=fmtDate(post.publishedAt); dateEl.setAttribute('datetime',post.publishedAt||'');
  document.getElementById('pt-read').textContent=`${mins} min read`;

  // Tags
  const tagsEl=document.getElementById('pt-tags');
  if(tagsEl&&post.tags?.length) tagsEl.innerHTML=post.tags.map(t=>`<span class="pt-tag">${esc(t)}</span>`).join('');

  // Body
  const bodyEl=document.getElementById('pt-body');
  if(bodyEl) bodyEl.innerHTML=renderBody(post.body||[]);

  // TOC
  buildTOC(_tocEntries);

  // Sharing
  initSharing(post.title);

  // Prev / Next
  if(adjacent.prev){
    const el=document.getElementById('pt-nav-prev');
    el.href=`/post?slug=${encodeURIComponent(adjacent.prev.slug.current)}`;
    document.getElementById('pt-nav-prev-title').textContent=adjacent.prev.title;
    el.hidden=false;
  }
  if(adjacent.next){
    const el=document.getElementById('pt-nav-next');
    el.href=`/post?slug=${encodeURIComponent(adjacent.next.slug.current)}`;
    document.getElementById('pt-nav-next-title').textContent=adjacent.next.title;
    el.hidden=false;
  }

  // More posts
  const moreEl=document.getElementById('pt-more');
  const moreGrid=document.getElementById('pt-more-grid');
  if(more.length&&moreGrid){
    moreGrid.innerHTML=more.map((p,i)=>miniCard(p).replace(
      `class="bl-card bl-card--small"`,
      `class="bl-card bl-card--small bl-reveal" style="--bl-delay:${i*0.1}s"`
    )).join('');
    requestAnimationFrame(()=>{
      moreGrid.querySelectorAll('.bl-reveal').forEach(el=>{
        const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});},{threshold:0.06});
        obs.observe(el);
      });
    });
  } else if(moreEl) {
    moreEl.hidden=true;
  }

  // Show
  document.getElementById('pt-loading').hidden=true;
  document.getElementById('pt-article').hidden=false;
  initProgress();
  initCoverParallax();
  if(_rebindCursorHover) _rebindCursorHover();
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO POST — hardcoded sample for design preview at /post?slug=__demo__
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_POST = {
  _id:'demo',
  title:'Lorem Ipsum: E-Commerce & the Future of Digital Retail',
  slug:{current:'__demo__'},
  publishedAt:'2026-05-26T09:00:00Z',
  category:'ecommerce',
  tags:['Lorem Ipsum','E-Commerce','Strategy','Demo'],
  excerpt:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — a preview of what your posts will look like.',
  coverImage:{asset:{_ref:'image-demo'},alt:'E-Commerce editorial cover'},
  featured:true,
  body:[
    {_type:'block',style:'normal',_key:'p0',children:[{_type:'span',text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}]},
    {_type:'block',style:'normal',_key:'p0b',children:[{_type:'span',text:'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.'}]},

    {_type:'block',style:'h2',_key:'h1',children:[{_type:'span',text:'Section One: Dolor Sit Amet'}]},
    {_type:'block',style:'normal',_key:'p1',children:[{_type:'span',text:'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'}]},
    {_type:'block',style:'normal',_key:'p1b',children:[{_type:'span',text:'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum.'}]},

    {_type:'block',style:'blockquote',_key:'q1',children:[{_type:'span',text:'"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi."'}]},

    {_type:'block',style:'h2',_key:'h2',children:[{_type:'span',text:'Section Two: Consectetur Adipiscing'}]},
    {_type:'block',style:'normal',_key:'p2',children:[{_type:'span',text:'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.'}]},
    {_type:'block',style:'h3',_key:'h2a',children:[{_type:'span',text:'Sub-section: Ut Labore'}]},
    {_type:'block',style:'normal',_key:'p2a',children:[{_type:'span',text:'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.'}]},
    {_type:'block',style:'normal',_key:'p2b',children:[{_type:'span',marks:['strong'],text:'Key insight:'},{_type:'span',text:' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis ipsum at felis dignissim, vitae molestie arcu varius. Mauris euismod ipsum nec enim tincidunt, eu accumsan nisi faucibus.'}]},

    {_type:'block',style:'h2',_key:'h3',children:[{_type:'span',text:'Section Three: Three Key Takeaways'}]},
    {_type:'block',style:'normal',_key:'p3',children:[{_type:'span',text:'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Here is what the bullet list style looks like in this editorial design:'}]},
    {_type:'block',_key:'li1',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}]},
    {_type:'block',_key:'li2',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur consequat.'}]},
    {_type:'block',_key:'li3',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}]},

    {_type:'block',style:'h3',_key:'h3b',children:[{_type:'span',text:'Closing Thoughts'}]},
    {_type:'block',style:'normal',_key:'p4',children:[{_type:'span',text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis ipsum at felis dignissim, vitae molestie arcu varius. Mauris euismod ipsum nec enim tincidunt, eu accumsan nisi faucibus. Integer vulputate lectus feugiat felis condimentum, a sodales tortor dapibus.'}]},
    {_type:'block',style:'normal',_key:'p5',children:[{_type:'span',text:'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla quis lorem ut libero malesuada feugiat. Pellentesque in ipsum id orci porta dapibus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh, donec sollicitudin molestie malesuada.'}]},
  ]
};

// Override cover image for demo — use a direct URL
const DEMO_COVER_URL = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1400&auto=format&fit=crop&q=80&sat=-15';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  initTheme();
  _rebindCursorHover = initCursor();
  const slugVal=new URLSearchParams(window.location.search).get('slug');

  // Sanitize slugVal before embedding in GROQ query — prevents GROQ injection
  // Valid Sanity slugs are URL-safe: letters, digits, hyphens, underscores
  const SLUG_RE = /^[a-zA-Z0-9_-]{1,200}$/;

  if(!slugVal || (!SLUG_RE.test(slugVal) && slugVal !== '__demo__')){
    document.getElementById('pt-loading').hidden=true;
    document.getElementById('pt-notfound').hidden=false;
    return;
  }

  // Demo mode — renders without Sanity
  if(slugVal==='__demo__'){
    const post=DEMO_POST;
    const cover=document.getElementById('pt-cover');
    if(cover){ cover.style.backgroundImage=`url('${DEMO_COVER_URL}')`; cover.style.backgroundSize='cover'; cover.style.backgroundPosition='center'; }
    // Patch imgUrl for demo so cover ref doesn't break
    const _orig=window.__demoMode;
    renderPost(post,{prev:null,next:null},[]);
    // Fix cover (renderPost uses coverImage ref, override after)
    const c=document.getElementById('pt-cover');
    if(c){ c.style.backgroundImage=`url('${DEMO_COVER_URL}')`; c.style.backgroundSize='cover'; c.style.backgroundPosition='center'; }
    return;
  }

  try {
    const post=await fetchPost(slugVal);
    if(!post){
      document.getElementById('pt-loading').hidden=true;
      document.getElementById('pt-notfound').hidden=false;
      return;
    }
    const [adjacent,more]=await Promise.all([fetchAdjacent(post.publishedAt),fetchMore(slugVal,post.publishedAt)]);
    renderPost(post,adjacent,more);
  } catch(e) {
    console.error('[post]',e);
    document.getElementById('pt-loading').hidden=true;
    document.getElementById('pt-fetcherror').hidden=false;
  }
}

main();
