/**
 * post.js — The Dispatch: single post page
 * Alec-template-inspired split hero + centred body.
 *
 * Features: scroll progress, breadcrumb, TOC + active section,
 * social sharing (X, LinkedIn, copy-link), prev/next, more-posts,
 * JSON-LD, OG meta, Portable Text renderer.
 */

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
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${w}&auto=format&fit=crop&sat=-5`;
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
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO POST — hardcoded sample for design preview at /post?slug=__demo__
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_POST = {
  _id:'demo',
  title:'Why AI Won\'t Kill E-Commerce — It Will Reinvent It',
  slug:{current:'__demo__'},
  publishedAt:'2026-05-26T09:00:00Z',
  category:'ecommerce',
  tags:['AI','E-Commerce','Strategy','Retail'],
  excerpt:'The hype cycle is in full swing. Here\'s what\'s actually happening beneath the surface of AI-powered shopping — and why the best operators are already three steps ahead.',
  coverImage:{
    asset:{_ref:'image-demo'},
    alt:'Digital storefront with AI interface overlay'
  },
  featured:true,
  body:[
    {_type:'block',style:'normal',_key:'a1',children:[{_type:'span',text:'The hype cycle is at full throttle. Every week brings another headline about AI replacing search, AI replacing checkout, AI replacing the customer service team entirely. Most of it is noise. But underneath the noise, something real is shifting — and the operators who understand it are quietly building an enormous lead.'}]},
    {_type:'block',style:'h2',_key:'a2',children:[{_type:'span',text:'The Three Waves of AI in Retail'}]},
    {_type:'block',style:'normal',_key:'a3',children:[{_type:'span',text:'The first wave was recommendation engines. Netflix, Spotify, Amazon — all built on the insight that predicting what someone wants next is worth more than any single transaction. The second wave was demand forecasting and logistics optimisation: the invisible machinery that means your order arrives tomorrow instead of next week.'}]},
    {_type:'block',style:'normal',_key:'a4',children:[{_type:'span',text:'We\'re entering the third wave, and it\'s qualitatively different from the first two. The first two waves made existing processes faster. This wave is changing what processes exist at all.'}]},
    {_type:'block',style:'blockquote',_key:'a5',children:[{_type:'span',text:'The brands winning in five years won\'t be the ones who adopted AI earliest. They\'ll be the ones who reimagined their customer relationships around what AI makes newly possible.'}]},
    {_type:'block',style:'h2',_key:'a6',children:[{_type:'span',text:'What Actually Changes at the Checkout'}]},
    {_type:'block',style:'normal',_key:'a7',children:[{_type:'span',text:'The most interesting territory right now isn\'t the front-end chatbot. Everyone has a chatbot. The interesting territory is in how AI changes the economics of personalisation at scale.'}]},
    {_type:'block',style:'normal',_key:'a8',children:[{_type:'span',text:'Consider dynamic bundling. For years, bundles were a blunt instrument — merchandisers would build a handful of curated sets, run them for a season, measure attachment rates, iterate slowly. With AI, every customer session can generate a bundle tailored to that specific basket in real time, priced to the margin target, offered at exactly the right moment in the journey.'}]},
    {_type:'block',style:'h3',_key:'a9',children:[{_type:'span',text:'The Margin Arithmetic'}]},
    {_type:'block',style:'normal',_key:'a10',children:[{_type:'span',text:'This matters because e-commerce margins are structurally thin. The average Shopify store runs at 10–20% gross margin after COGS. Take out fulfilment, returns, and paid acquisition and most direct-to-consumer brands are fighting over single-digit net margins.'}]},
    {_type:'block',style:'normal',_key:'a11',children:[{_type:'span',text:'AI-driven personalisation doesn\'t just increase AOV — it reduces the acquisition cost per profitable order. Those are two very different levers, and they compound.'}]},
    {_type:'block',style:'h2',_key:'a12',children:[{_type:'span',text:'Three Things You Should Be Doing Right Now'}]},
    {_type:'block',style:'normal',_key:'b1',children:[{_type:'span',text:'Rather than a sweeping roadmap, here are the three highest-leverage moves for any mid-market operator:'}]},
    {_type:'block',_key:'b2',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Audit your zero-party data strategy. The AI models that will win at personalisation need signal. Email open rates are not signal. Purchase history, explicit preference capture, and post-purchase surveys are signal. Start collecting it deliberately.'}]},
    {_type:'block',_key:'b3',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Run a held-out test on your email and SMS cadences using an AI copy tool. Don\'t replace your copywriter — give them a co-pilot. Measure lift in click-to-purchase rate, not vanity open rates.'}]},
    {_type:'block',_key:'b4',style:'normal',listItem:'bullet',children:[{_type:'span',text:'Map your customer service ticket categories and identify the top three by volume that could be resolved in a single AI-assisted interaction. Route those to a well-prompted LLM. Measure CSAT before and after.'}]},
    {_type:'block',style:'h3',_key:'b5',children:[{_type:'span',text:'The Honest Caveat'}]},
    {_type:'block',style:'normal',_key:'b6',children:[{_type:'span',text:'None of this is magic. AI amplifies what\'s already there. If your product is mediocre, AI will help you sell mediocre product to more people more efficiently — until retention craters and your LTV model falls apart. The fundamentals still matter. Product, price, and trust are not features AI can generate for you.'}]},
    {_type:'block',style:'normal',_key:'b7',children:[{_type:'span',text:'But if you\'re already doing the fundamentals right, AI is the best margin-expansion opportunity this industry has seen since mobile. The operators who treat it as a tool rather than a strategy will extract meaningful value. The ones waiting for a turnkey solution will still be waiting when the window closes.'}]},
  ]
};

// Override cover image for demo — use a direct URL
const DEMO_COVER_URL = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1400&auto=format&fit=crop&q=80&sat=-15';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  initTheme();
  const slugVal=new URLSearchParams(window.location.search).get('slug');

  if(!slugVal){
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
