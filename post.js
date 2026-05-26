/**
 * post.js — Single blog post page
 *
 * Features:
 *  - Reads ?slug= URL param, fetches post from Sanity CDN
 *  - Portable Text → HTML renderer (vanilla JS, no deps)
 *  - Scroll progress bar
 *  - Auto-generated Table of Contents with active-section tracking
 *  - Social sharing: Twitter/X, LinkedIn, copy-link
 *  - Prev / Next post navigation
 *  - Author, breadcrumb, read time, date, tags, category
 *  - Dark mode support
 *  - SEO: <title>, OG tags, JSON-LD Article
 */

const PROJECT_ID = 'p4gxllem';
const DATASET    = 'production';
const API_VER    = '2024-01-01';
const CDN        = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VER}/data/query/${DATASET}`;

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slug(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

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

function sanityImageUrl(ref, width = 1200) {
  if (!ref) return null;
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id  = parts.join('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}.${ext}?w=${width}&auto=format`;
}

const CATEGORY_LABELS = {
  ecommerce: 'E-Commerce',
  ai: 'Artificial Intelligence',
  market: 'Market Insights',
  opinion: 'Opinion',
  strategy: 'Strategy',
};

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT → HTML RENDERER
// ─────────────────────────────────────────────────────────────────────────────

let tocEntries = []; // collected while rendering, used for TOC

function renderMark(mark, text, annotations) {
  if (mark === 'strong') return `<strong>${text}</strong>`;
  if (mark === 'em')     return `<em>${text}</em>`;
  if (mark === 'code')   return `<code>${text}</code>`;
  // Link annotation
  const ann = annotations?.find(a => a._key === mark);
  if (ann?._type === 'link' || ann?.href) {
    const href  = ann.href || '#';
    const blank = ann.blank !== false;
    return `<a href="${esc(href)}"${blank ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
  }
  return text;
}

function renderSpans(children = [], markDefs = []) {
  return children.map(span => {
    if (span._type !== 'span') return '';
    let text = esc(span.text || '');
    // Apply marks innermost-first (reversed)
    const marks = [...(span.marks || [])].reverse();
    marks.forEach(mark => {
      text = renderMark(mark, text, markDefs);
    });
    return text;
  }).join('');
}

function renderBlock(block) {
  if (block._type === 'image') {
    const url = sanityImageUrl(block.asset?._ref, 1200);
    if (!url) return '';
    const alt     = esc(block.alt || '');
    const caption = block.caption ? `<figcaption class="post-img__caption">${esc(block.caption)}</figcaption>` : '';
    return `<figure class="post-img">\n  <img src="${url}" alt="${alt}" loading="lazy" />\n  ${caption}\n</figure>`;
  }

  if (block._type !== 'block') return '';

  const inner = renderSpans(block.children, block.markDefs);
  const style = block.style || 'normal';
  const listItem = block.listItem;

  // List items are collected into lists by wrapBlocks
  if (listItem) {
    return { _listItem: listItem, _level: block.level || 1, html: `<li>${inner}</li>` };
  }

  if (style === 'h2') {
    const id = slug(block.children?.map(s => s.text).join('') || '');
    const text = block.children?.map(s => s.text).join('') || '';
    tocEntries.push({ level: 2, id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  }
  if (style === 'h3') {
    const id = slug(block.children?.map(s => s.text).join('') || '');
    const text = block.children?.map(s => s.text).join('') || '';
    tocEntries.push({ level: 3, id, text });
    return `<h3 id="${id}">${inner}</h3>`;
  }
  if (style === 'h4') return `<h4>${inner}</h4>`;
  if (style === 'blockquote') return `<blockquote><p>${inner}</p></blockquote>`;
  if (style === 'normal') return `<p>${inner}</p>`;
  return `<p>${inner}</p>`;
}

function wrapBlocks(blocks = []) {
  tocEntries = [];
  const htmlParts = [];
  let currentList = null;
  let currentListType = null;

  const flushList = () => {
    if (currentList) {
      const tag = currentListType === 'bullet' ? 'ul' : 'ol';
      htmlParts.push(`<${tag}>${currentList.join('')}</${tag}>`);
      currentList = null;
      currentListType = null;
    }
  };

  blocks.forEach(block => {
    const rendered = renderBlock(block);
    if (rendered && typeof rendered === 'object' && rendered._listItem) {
      if (currentListType !== rendered._listItem) {
        flushList();
        currentList = [];
        currentListType = rendered._listItem;
      }
      currentList.push(rendered.html);
    } else {
      flushList();
      if (rendered) htmlParts.push(rendered);
    }
  });
  flushList();
  return htmlParts.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITY FETCH
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPost(slugValue) {
  const query = encodeURIComponent(
    `*[_type == "post" && slug.current == "${slugValue}"][0]{
      _id, title, slug, publishedAt, category, tags, excerpt,
      coverImage { asset, alt },
      body[] {
        ...,
        _type == "image" => { ..., asset-> }
      },
      featured
    }`
  );
  const res = await fetch(`${CDN}?query=${query}`);
  if (!res.ok) throw new Error(`Sanity error: ${res.status}`);
  const data = await res.json();
  return data.result || null;
}

async function fetchAdjacentPosts(slugValue, publishedAt) {
  const prevQuery = encodeURIComponent(
    `*[_type == "post" && publishedAt < "${publishedAt}"] | order(publishedAt desc)[0]{ title, slug }`
  );
  const nextQuery = encodeURIComponent(
    `*[_type == "post" && publishedAt > "${publishedAt}"] | order(publishedAt asc)[0]{ title, slug }`
  );

  const [prevRes, nextRes] = await Promise.all([
    fetch(`${CDN}?query=${prevQuery}`),
    fetch(`${CDN}?query=${nextQuery}`),
  ]);
  const prevData = await prevRes.json();
  const nextData = await nextRes.json();
  return {
    prev: prevData.result || null,
    next: nextData.result || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

function initScrollProgress() {
  const fill = document.getElementById('post-progress-fill');
  if (!fill) return;
  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    fill.style.width = pct + '%';
    document.getElementById('post-progress')?.setAttribute('aria-valuenow', Math.round(pct));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE OF CONTENTS — active section tracking
// ─────────────────────────────────────────────────────────────────────────────

function buildTOC(entries) {
  const tocList = document.getElementById('post-toc-list');
  const tocEl   = document.getElementById('post-toc');
  if (!tocList || !entries.length) {
    if (tocEl) tocEl.hidden = true;
    return;
  }
  tocEl.hidden = false;

  tocList.innerHTML = entries.map(({ id, text, level }) =>
    `<a href="#${id}" class="post-toc__item post-toc__item--h${level}" data-id="${id}">${esc(text)}</a>`
  ).join('');

  // Intersection observer for active section
  const links = [...tocList.querySelectorAll('.post-toc__item')];
  const headings = entries.map(e => document.getElementById(e.id)).filter(Boolean);

  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => a.classList.toggle('is-active', a.dataset.id === id));
      }
    });
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));

  // Click scrolls smoothly
  tocList.addEventListener('click', e => {
    const link = e.target.closest('.post-toc__item');
    if (!link) return;
    e.preventDefault();
    const target = document.getElementById(link.dataset.id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL SHARING
// ─────────────────────────────────────────────────────────────────────────────

function initSharing(title) {
  const url = window.location.href;

  document.getElementById('share-twitter')?.addEventListener('click', () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank', 'noopener,noreferrer'
    );
  });

  document.getElementById('share-linkedin')?.addEventListener('click', () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank', 'noopener,noreferrer'
    );
  });

  const copyBtn   = document.getElementById('share-copy');
  const copyLabel = document.getElementById('share-copy-label');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      copyLabel.textContent = 'Copied!';
      copyBtn.classList.add('is-copied');
      setTimeout(() => {
        copyLabel.textContent = 'Copy link';
        copyBtn.classList.remove('is-copied');
      }, 2000);
    } catch {
      copyLabel.textContent = 'Copy failed';
      setTimeout(() => { copyLabel.textContent = 'Copy link'; }, 2000);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO META INJECTION
// ─────────────────────────────────────────────────────────────────────────────

function injectMeta(post, canonicalUrl, ogImageUrl) {
  document.title = `${post.title} — Melvyn Cross`;

  const setMeta = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(el.hasAttribute('content') ? 'content' : 'property', val);
  };
  const setMetaContent = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute('content', val);
  };

  setMetaContent('meta[name="description"]', post.excerpt || '');
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[property="og:title"]', post.title);
  setMetaContent('meta[property="og:description"]', post.excerpt || '');
  if (ogImageUrl) setMetaContent('meta[property="og:image"]', ogImageUrl);
  setMetaContent('meta[name="twitter:title"]', post.title);
  setMetaContent('meta[name="twitter:description"]', post.excerpt || '');
  if (ogImageUrl) setMetaContent('meta[name="twitter:image"]', ogImageUrl);

  // JSON-LD
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Melvyn Cross',
      url: 'https://melvyncross.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Melvyn Cross',
    },
    url: canonicalUrl,
  };
  if (ogImageUrl) ld.image = ogImageUrl;
  document.getElementById('jsonld-article').textContent = JSON.stringify(ld);
}

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// RENDER POST
// ─────────────────────────────────────────────────────────────────────────────

function renderPost(post, adjacent) {
  const canonicalUrl = window.location.href;
  const readMin      = estimateReadTime(post.body);
  const catLabel     = CATEGORY_LABELS[post.category] || post.category || '';
  const coverRef     = post.coverImage?.asset?._ref;
  const coverUrl     = coverRef ? sanityImageUrl(coverRef, 1400) : null;

  // SEO
  injectMeta(post, canonicalUrl, coverUrl || '');

  // Cover
  const coverEl = document.getElementById('post-cover');
  if (coverUrl && coverEl) {
    coverEl.innerHTML = `<img class="post-cover__img" src="${coverUrl}" alt="${esc(post.coverImage?.alt || post.title)}" />`;
  } else if (coverEl) {
    coverEl.classList.add('post-cover--empty');
  }

  // Breadcrumb title
  document.getElementById('breadcrumb-title').textContent = post.title;

  // Category
  const catEl = document.getElementById('post-cat');
  if (catEl && catLabel) {
    catEl.textContent = catLabel;
    catEl.className = `post-header__cat post-header__cat--${post.category || 'other'}`;
  }

  // Tags
  const tagsEl = document.getElementById('post-tags');
  if (tagsEl && post.tags?.length) {
    tagsEl.innerHTML = post.tags.map(t => `<span class="post-tag">${esc(t)}</span>`).join('');
  }

  // Title
  document.getElementById('post-title').textContent = post.title;

  // Date + read time
  document.getElementById('post-date').textContent = formatDate(post.publishedAt);
  document.getElementById('post-date').setAttribute('datetime', post.publishedAt);
  document.getElementById('post-read').textContent = `${readMin} min read`;

  // Body
  const bodyEl = document.getElementById('post-body');
  if (bodyEl) bodyEl.innerHTML = wrapBlocks(post.body || []);

  // TOC (built after body is rendered so headings have IDs)
  buildTOC(tocEntries);

  // Sharing
  initSharing(post.title);

  // Prev / Next
  if (adjacent.prev) {
    const prev = document.getElementById('post-nav-prev');
    prev.href = `/post?slug=${encodeURIComponent(adjacent.prev.slug.current)}`;
    document.getElementById('post-nav-prev-title').textContent = adjacent.prev.title;
    prev.hidden = false;
  }
  if (adjacent.next) {
    const next = document.getElementById('post-nav-next');
    next.href = `/post?slug=${encodeURIComponent(adjacent.next.slug.current)}`;
    document.getElementById('post-nav-next-title').textContent = adjacent.next.title;
    next.hidden = false;
  }

  // Show article, hide loading
  document.getElementById('post-loading').hidden  = true;
  document.getElementById('post-article').hidden  = false;

  // Scroll progress (activate after reveal)
  initScrollProgress();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  initTheme();

  const params    = new URLSearchParams(window.location.search);
  const slugValue = params.get('slug');

  if (!slugValue) {
    document.getElementById('post-loading').hidden  = true;
    document.getElementById('post-notfound').hidden = false;
    return;
  }

  try {
    const post = await fetchPost(slugValue);

    if (!post) {
      document.getElementById('post-loading').hidden  = true;
      document.getElementById('post-notfound').hidden = false;
      return;
    }

    const adjacent = await fetchAdjacentPosts(slugValue, post.publishedAt);
    renderPost(post, adjacent);

  } catch (err) {
    console.error('[post.js]', err);
    document.getElementById('post-loading').hidden    = true;
    document.getElementById('post-fetcherror').hidden = false;
  }
}

main();
