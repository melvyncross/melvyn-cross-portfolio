# Melvyn Cross — Personal Site

Editorial portfolio. Built as a long-form scroll story about the Planet Soar build.

**Live:** [melvyn-cross.vercel.app](https://melvyn-cross.vercel.app) · **Repo:** [github.com/melvyncross/melvyn-cross-portfolio](https://github.com/melvyncross/melvyn-cross-portfolio)

## Stack

- Pure HTML / CSS / vanilla JS — no frameworks, no build step
- Google Fonts (Fraunces, Inter Tight, JetBrains Mono) loaded via CDN
- IntersectionObserver for reveals, requestAnimationFrame for parallax + counters
- Honours `prefers-reduced-motion`

## Deploy to Vercel (3 minutes)

1. Drag the entire `site` folder onto [vercel.com/new](https://vercel.com/new)
2. Project name: `melvyn-cross` (or whatever you like)
3. Framework preset: **Other**
4. Click **Deploy**

You'll get a `*.vercel.app` URL immediately. To attach a custom domain:

1. Project Settings → Domains → Add
2. Point your registrar's DNS at Vercel's nameservers (or use the CNAME they give you)
3. SSL is automatic

## Add the CV download

Drop your `Melvyn_Cross_CV.pdf` in the same folder as `index.html`. The download button in the Contact section will pick it up automatically. No code change needed.

## Customising

- **Numbers / story copy** → `index.html` only
- **Colours / type / spacing** → CSS variables at the top of `styles.css`
- **Animation timing** → also at the top of `styles.css` and inside `script.js`

## Performance budget

- First paint: < 800ms on 4G
- LCP: < 1.5s
- Total page weight: ~30KB HTML/CSS/JS + Google Fonts
- Lighthouse Performance: should score 95+

## What's NOT in v1 (deferred to v2)

- FR translation toggle
- Case study sub-pages
- Contact form (mailto for now)
