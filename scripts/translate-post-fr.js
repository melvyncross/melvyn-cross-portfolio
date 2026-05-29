/**
 * translate-post-fr.js
 *
 * Patches the existing SEO blog post with a full French translation,
 * populating the title_fr, excerpt_fr, and body_fr fields in Sanity.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/translate-post-fr.js
 *
 * How to get a write token:
 *   1. Go to https://www.sanity.io/manage/personal/project/p4gxllem/api
 *   2. Click "Add API token" → choose "Editor" → copy the token
 *   3. Run this script once — it patches the document in production
 */

import { createClient } from '@sanity/client';

const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) {
  console.error('[translate-post-fr] SANITY_WRITE_TOKEN is not set.');
  console.error('  Get an Editor token from https://www.sanity.io/manage/personal/project/p4gxllem/api');
  process.exit(1);
}

const client = createClient({
  projectId:  'p4gxllem',
  dataset:    'production',
  useCdn:     false,
  apiVersion: '2024-01-01',
  token:      TOKEN,
});

const POST_ID = '1505bae4-6f37-4fee-8080-e50eeb8f01b1';

const title_fr = 'La Réécriture du Manuel SEO en 2026 : Ce que les E-Commerces Doivent Savoir';

const excerpt_fr = 'La stratégie SEO qui fonctionnait en 2022 vous nuit activement en 2026. Les positions dans les SERPs ne sont plus la métrique principale.';

const body_fr = [
  {
    _key: 'fr-h2-1', _type: 'block', style: 'h2', markDefs: [],
    children: [{ _key: 'fr-h2-1-s', _type: 'span', marks: ['strong'],
      text: "Qu'est-ce que la Réécriture du Manuel SEO ?" }],
  },
  {
    _key: 'fr-p1', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p1-s', _type: 'span', marks: [],
      text: "Le paysage SEO en 2026 a évolué plus radicalement ces 18 derniers mois que durant les cinq années précédentes réunies. Les aperçus IA de Google dominent désormais le haut de la plupart des SERPs. ChatGPT, Perplexity et Gemini répondent aux questions sans renvoyer les utilisateurs vers des sites web. Et les agents IA commencent à prendre des décisions d'achat au nom des consommateurs." }],
  },
  {
    _key: 'fr-p2', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p2-s', _type: 'span', marks: [],
      text: "Si vous gérez une boutique en ligne en 2026, vous n'optimisez plus seulement pour Google. Vous optimisez pour des machines qui lisent, interprètent et citent votre contenu -- ou ne le font pas." }],
  },
  {
    _key: 'fr-p3', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p3-s', _type: 'span', marks: [],
      text: "C'est le changement fondamental. Et la plupart des managers e-commerce n'ont pas encore pleinement opéré cette transition." }],
  },
  {
    _key: 'fr-h2-2', _type: 'block', style: 'h2', markDefs: [],
    children: [{ _key: 'fr-h2-2-s', _type: 'span', marks: ['strong'],
      text: 'Pourquoi les Positions dans les SERPs Ne Suffisent Plus' }],
  },
  {
    _key: 'fr-p4', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p4-s', _type: 'span', marks: [],
      text: "Soyons honnêtes sur ce qui arrive au trafic organique. Les aperçus IA apparaissent désormais pour la majorité des requêtes commerciales et informationnelles, repoussant les liens bleus organiques sous la ligne de flottaison. Vous pouvez vous classer #1 et obtenir quasi-zéro clic." }],
  },
  {
    _key: 'fr-p5', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p5-s', _type: 'span', marks: [],
      text: "Les boutiques qui gagnent en SEO e-commerce en 2026 ne courent pas après les positions -- elles construisent leur citabilité. La question est passée de « Comment me classer pour ce mot-clé ? » à « Comment devenir la source que l'IA utilise pour répondre à cette question ? »" }],
  },
  {
    _key: 'fr-p6', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p6-s', _type: 'span', marks: [],
      text: 'Le changement de mentalité en pratique :' }],
  },
  {
    _key: 'fr-p7', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p7-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-p8', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p8-s', _type: 'span', marks: [],
      text: 'Arrêter : Cibler des mots-clés à fort volume pour générer du trafic brut' }],
  },
  {
    _key: 'fr-p9', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p9-s', _type: 'span', marks: [],
      text: "Commencer : Cibler les questions à forte intention que votre acheteur idéal pose aux outils IA" }],
  },
  {
    _key: 'fr-p10', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p10-s', _type: 'span', marks: [],
      text: 'Arrêter : Mesurer le succès par la position n°1 en première page' }],
  },
  {
    _key: 'fr-p11', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p11-s', _type: 'span', marks: [],
      text: "Commencer : Mesurer la fréquence de citation IA -- à quelle fréquence votre marque apparaît dans les réponses générées par l'IA" }],
  },
  {
    _key: 'fr-p12', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p12-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-h2-3', _type: 'block', style: 'h2', markDefs: [],
    children: [{ _key: 'fr-h2-3-s', _type: 'span', marks: ['strong'],
      text: 'La Recherche Partout : Au-delà de Google' }],
  },
  {
    _key: 'fr-p13', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p13-s', _type: 'span', marks: [],
      text: "L'optimisation pour la recherche IA en 2026 signifie apparaître partout où votre client prend une décision -- et c'est de moins en moins sur Google." }],
  },
  {
    _key: 'fr-p14', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p14-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-p15', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p15-s', _type: 'span', marks: [],
      text: 'Votre stratégie de visibilité doit couvrir :' }],
  },
  {
    _key: 'fr-li1', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _key: 'fr-li1-s', _type: 'span', marks: [],
      text: 'Google AI Overviews -- contenu structuré, E-E-A-T, schema markup' }],
  },
  {
    _key: 'fr-li2', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _key: 'fr-li2-s', _type: 'span', marks: [],
      text: "ChatGPT / Perplexity / Gemini -- autorité d'entité, citations, mentions de marque sur le web" }],
  },
  {
    _key: 'fr-li3', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _key: 'fr-li3-s', _type: 'span', marks: [],
      text: "YouTube -- démos et guides produits qui se classent dans Google et renforcent l'autorité de marque" }],
  },
  {
    _key: 'fr-li4', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _key: 'fr-li4-s', _type: 'span', marks: [],
      text: 'TikTok / Instagram -- la recherche sociale est un canal de découverte majeur pour le e-commerce B2C' }],
  },
  {
    _key: 'fr-li5', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _key: 'fr-li5-s', _type: 'span', marks: [],
      text: 'Amazon / Google Shopping -- flux produits optimisés avec des titres clairs, des attributs et des prix' }],
  },
  {
    _key: 'fr-p16', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p16-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-p17', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p17-s', _type: 'span', marks: [],
      text: "Les boutiques qui traitent ces canaux séparément travaillent cinq fois plus dur que celles qui construisent une stratégie de contenu et d'entité unifiée les alimentant tous simultanément." }],
  },
  {
    _key: 'fr-p18', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p18-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-h2-4', _type: 'block', style: 'h2', markDefs: [],
    children: [{ _key: 'fr-h2-4-s', _type: 'span', marks: ['strong'],
      text: 'Conclusion : La Stratégie SEO en 2026' }],
  },
  {
    _key: 'fr-p19', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p19-s', _type: 'span', marks: [],
      text: "Les gagnants de la stratégie SEO 2026 font une chose avant tout : ils construisent la présence d'expert la plus fiable, la mieux structurée et la plus compréhensible par les machines dans leur niche." }],
  },
  {
    _key: 'fr-p20', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p20-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-p21', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p21-s', _type: 'span', marks: [],
      text: "Les positions sont un indicateur retardé. L'autorité est l'indicateur avancé. Maîtrisez votre E-E-A-T, structurez votre contenu pour la récupération par l'IA, rendez vos fondations techniques inattaquables, et soyez présent de façon cohérente sur chaque plateforme où votre acheteur prend une décision." }],
  },
  {
    _key: 'fr-p22', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p22-s', _type: 'span', marks: [], text: '' }],
  },
  {
    _key: 'fr-p23', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'fr-p23-s', _type: 'span', marks: [],
      text: "La fenêtre pour prendre de l'avance est encore ouverte -- mais elle se ferme rapidement." }],
  },
];

async function main() {
  console.log('[translate-post-fr] Patching post', POST_ID, 'with French translation…');
  const result = await client
    .patch(POST_ID)
    .set({ title_fr, excerpt_fr, body_fr })
    .commit();
  console.log('[translate-post-fr] ✅ Done —', result._id);
}

main().catch(err => {
  console.error('[translate-post-fr] ✗', err.message);
  process.exit(1);
});
