/**
 * patch-editorial.js — one-time script to populate the editorial field
 * on blogPageContent, educationContent, and qualificationsContent.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=xxx node scripts/patch-editorial.js
 *
 * The token must have write permissions. Delete it from Sanity after use.
 */

import { createClient } from '@sanity/client';

const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) {
  console.error('SANITY_WRITE_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId:  'p4gxllem',
  dataset:    'production',
  apiVersion: '2024-01-01',
  token:      TOKEN,
  useCdn:     false,
});

// Helper: build a Portable Text block from a single paragraph string.
// Supports **bold** and *italic* inline marks.
let keyCounter = 0;
const k = () => `k${(++keyCounter).toString(36)}`;

function paragraph(text) {
  // Split into runs of marked and unmarked text
  const children = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    let nextMark = -1;
    let markType = null;
    let markLen  = 0;

    const boldIdx = text.indexOf('**', i);
    const italIdx = text.indexOf('*',  i);
    // Prefer ** before single * when both at same index
    if (boldIdx !== -1 && (italIdx === -1 || boldIdx <= italIdx)) {
      nextMark = boldIdx;
      markType = 'strong';
      markLen  = 2;
    } else if (italIdx !== -1) {
      nextMark = italIdx;
      markType = 'em';
      markLen  = 1;
    }

    if (nextMark === -1) {
      // No more marks — push remainder
      children.push({ _type: 'span', _key: k(), text: text.slice(i), marks: [] });
      break;
    }

    if (nextMark > i) {
      children.push({ _type: 'span', _key: k(), text: text.slice(i, nextMark), marks: [] });
    }

    const closeTok = markType === 'strong' ? '**' : '*';
    const closeIdx = text.indexOf(closeTok, nextMark + markLen);
    if (closeIdx === -1) {
      // Unbalanced — treat as plain
      children.push({ _type: 'span', _key: k(), text: text.slice(nextMark), marks: [] });
      break;
    }
    children.push({
      _type: 'span', _key: k(),
      text:  text.slice(nextMark + markLen, closeIdx),
      marks: [markType],
    });
    i = closeIdx + markLen;
  }

  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    markDefs: [],
    children,
  };
}

function blocks(paragraphs) {
  return paragraphs.map(p => paragraph(p));
}

// ── BLOG editorial ──────────────────────────────────────────────────────────
const blEn = [
  "The Dispatch exists because the topics that shape e-commerce — AI-driven personalisation, platform economics, shifting consumer behaviour, the slow collapse of third-party cookies — move faster than most coverage keeps up with. I follow them closely because they directly determine what works and what breaks in the online businesses I build and run.",
  "These articles are how I process what I'm watching: the signal inside the noise, the strategies worth keeping, and the assumptions the market is quietly discarding. I don't write to cover everything. I write when something is worth getting right.",
];
const blFr = [
  "The Dispatch existe parce que les sujets qui façonnent l'e-commerce — la personnalisation pilotée par l'IA, l'économie des plateformes, l'évolution du comportement des consommateurs, la disparition progressive des cookies tiers — évoluent plus vite que la plupart des analyses ne le suivent. Je les suis de près parce qu'ils déterminent directement ce qui fonctionne et ce qui casse dans les entreprises en ligne que je construis et gère.",
  "Ces articles sont ma façon de digérer ce que j'observe : le signal dans le bruit, les stratégies qui méritent d'être conservées, et les hypothèses que le marché abandonne discrètement. Je n'écris pas pour tout couvrir. J'écris quand un sujet mérite d'être traité correctement.",
];

// ── EDUCATION editorial ─────────────────────────────────────────────────────
const eduEn = [
  "My academic path was built around a single constraint: every theory needed a live application within weeks. Joining IUT de Lens the same year I started at Planet Soar wasn't a scheduling coincidence — it was the point. Three years of work-study compressed what most programmes spread across five, and the pressure of real commercial consequences made the learning stick in a way that a classroom alone cannot replicate.",
  "The move to ISG Paris came at the right moment. The apprenticeship had given me execution depth; the MSc gave me the strategic vocabulary to frame what I'd built and plan what comes next. The thesis project — a full business plan for a B2C e-commerce venture from a €15,000 starting position — is not an academic exercise. It's the blueprint I intend to use.",
  "From Botswana, where I completed secondary school, to Lens, to Paris: the geography changed but the logic didn't. Each step was chosen because it closed a specific gap.",
];
const eduFr = [
  "Mon parcours académique a été construit autour d'une contrainte unique : chaque théorie devait avoir une application concrète en quelques semaines. Rejoindre l'IUT de Lens la même année que mon entrée chez Planet Soar n'était pas une coïncidence d'agenda — c'était précisément le but. Trois ans d'alternance ont compressé ce que la plupart des programmes étalent sur cinq ans, et la pression de conséquences commerciales réelles a fait que l'apprentissage est resté d'une manière qu'une salle de classe seule ne peut reproduire.",
  "Le passage à l'ISG Paris est venu au bon moment. L'alternance m'avait donné la profondeur d'exécution ; le MSc m'a donné le vocabulaire stratégique pour formaliser ce que j'avais construit et planifier la suite. Le projet de thèse — un business plan complet pour une entreprise e-commerce B2C à partir d'un capital de 15 000 € — n'est pas un exercice académique. C'est le plan que j'ai l'intention d'utiliser.",
  "Du Botswana, où j'ai terminé mes études secondaires, à Lens, puis à Paris : la géographie a changé mais la logique non. Chaque étape a été choisie parce qu'elle comblait une lacune spécifique.",
];

// ── QUALIFICATIONS editorial ────────────────────────────────────────────────
const quaEn = [
  "I pursue certifications for a specific reason: structured learning forces me to systematise knowledge I've often acquired intuitively, and that process of formalisation exposes gaps I didn't know I had.",
  "The HubSpot Digital Marketing certification changed how I think about the full funnel — not just traffic acquisition but the entire chain from first contact to closed deal. The Google Analytics (GA4) certification made me a more rigorous analyst; being tested on the methodology rather than just the interface meant I had to understand why the numbers move, not just how to read them. The PMI certification I'm working towards is about project delivery — because managing cross-functional launches has taught me that a clear framework is the difference between a release that lands and one that drifts.",
  "Beyond the credentials, the discipline itself matters. Committing to structured study while running a live operation sharpens your relationship with your own knowledge — you learn what you actually understand versus what you've just seen work before.",
];
const quaFr = [
  "Je poursuis les certifications pour une raison précise : l'apprentissage structuré m'oblige à systématiser des connaissances que j'ai souvent acquises de manière intuitive, et ce processus de formalisation révèle des lacunes dont je n'avais pas conscience.",
  "La certification HubSpot Digital Marketing a changé ma façon de penser le funnel complet — pas seulement l'acquisition de trafic mais toute la chaîne du premier contact à la vente conclue. La certification Google Analytics (GA4) a fait de moi un analyste plus rigoureux ; être testé sur la méthodologie plutôt que sur l'interface signifiait devoir comprendre pourquoi les chiffres bougent, pas seulement comment les lire. La certification PMI vers laquelle je travaille concerne la livraison de projets — gérer des lancements transversaux m'a appris qu'un cadre clair fait la différence entre une mise en production qui atterrit et une qui dérive.",
  "Au-delà des diplômes, c'est la discipline elle-même qui compte. S'engager dans une étude structurée tout en opérant en production aiguise votre rapport à votre propre savoir — vous apprenez ce que vous comprenez vraiment par opposition à ce que vous avez simplement déjà vu fonctionner.",
];

async function patch(docId, en, fr) {
  console.log(`[patch] ${docId} …`);
  await client
    .patch(docId)
    .set({
      editorial: {
        _type: 'localizedPortableText',
        en: blocks(en),
        fr: blocks(fr),
      },
    })
    .commit();
  console.log(`[patch] ✓ ${docId} updated`);
}

(async () => {
  try {
    await patch('blogPageContent',         blEn,  blFr);
    await patch('educationContent',        eduEn, eduFr);
    await patch('qualificationsContent',   quaEn, quaFr);
    console.log('[patch] ✅ All three documents patched.');
    console.log('[patch] ⚠️  Reminder: delete the write token from Sanity now.');
  } catch (err) {
    console.error('[patch] ❌ FAILED:', err.message);
    process.exit(1);
  }
})();
