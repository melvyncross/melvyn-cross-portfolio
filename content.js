/* ============================================================
   MELVYN CROSS — CONTENT LAYER
   All translatable text lives here. EN is the default (also
   baked into HTML for SEO). FR strings replace innerHTML when
   the language toggle is active.

   To add / edit content: update the strings below, then
   git commit + git push → Vercel auto-deploys in ~2s.

   Future migration: these strings map 1-to-1 to Sanity fields.
   ============================================================ */

const content = {
  en: {
    /* ── NAV ── */
    nav_location: '<span class="nav__dot"></span>Lille → UK',

    /* ── 01. HERO ── */
    hero_label: 'An e-commerce builder, currently in transit.',
    hero_word_1: 'Melvyn',
    hero_word_2: '<em>Cross</em>',
    hero_caption_1: 'I spent six years building a Shopify storefront from nothing&nbsp;into a <strong>€1,600,000</strong>&nbsp;per&nbsp;year European e-commerce business.',
    hero_caption_2: 'I\'m now looking for the next one.',

    /* ── 02. THE NUMBER ── */
    number_label: 'The result, before the story',
    number_year: 'Nov 2020 → Sept 2026',
    number_target: 1600000,
    number_caption: 'Average annual revenue of <em>planetsoarshop.com</em>, a photovoltaic e-commerce I built and ran as the sole e-commerce lead.',

    /* ── 03. THE BEGINNING ── */
    beginning_chapter: 'Chapter I',
    beginning_chapter_name: 'The Beginning',
    beginning_title: 'November <em>2020</em>.',
    beginning_lead: 'No storefront. No catalogue. No suppliers. A company that wanted to sell solar online and didn\'t yet know how.',
    beginning_p1: 'I joined Planet Soar as their e-commerce lead. Within months I had a temporary contract turn into an apprenticeship, and an apprenticeship turn into the build of <em>planetsoarshop.com</em>. What started as a side channel became the company\'s commercial engine.',
    beginning_p2: 'Six years later, the online channel accounts for <strong>60% of revenue</strong> and sources <strong>100% of inbound demand</strong>. It is a story about scale, but also about <em>protecting</em> what works while everything around it changes.',

    /* ── 04. WHAT I BUILT ── */
    built_chapter: 'Chapter II',
    built_title: 'What <em>I</em> built.',
    built_intro: 'A Shopify storefront with 544 active SKUs at peak, served by nine European suppliers, supported by a custom shipping engine, and run by a team of seven.',
    stat_1_label: 'SKUs at catalogue peak',
    stat_1_note: 'Panels, batteries, inverters, EV chargers, accessories. Five categories, each with their own logistics constraints.',
    stat_2_label: 'European suppliers onboarded',
    stat_2_note: 'ENECSOL, VOLTANEO, KRANNICH, BAYWARE, ESTG, POWR CONNECT, ALLIANTZ, plus two irregular partners in Switzerland and Italy.',
    stat_3_label: 'Shipping profiles, hand-built',
    stat_3_note: 'The problem nobody wanted to solve: per-item shipping across nine suppliers with no carrier API. I built an internal cost model with <strong>~90% accuracy</strong>.',
    stat_4_label: 'Daily organic impressions at peak',
    stat_4_note: '~500 daily clicks, 2.5% CTR. All organic SEO. Paid was reserved for product launches and peak seasons only.',
    stat_5_label: 'People on the team',
    stat_5_note: 'Five sales representatives, one e-commerce assistant, plus oversight of the accounting function. KPIs, reporting cadence, process design.',
    stat_6_label: 'Revenue through the online channel',
    stat_6_note: 'Quotation funnel above €7,000. Direct conversion below. A deliberate split for a high-AOV catalogue, not a workaround.',

    /* ── 05. THE DEALS ── */
    deals_chapter: 'Chapter III',
    deals_title: 'Two deals <em>I</em> closed.',
    deal_1_route: 'Lille → Miami',
    deal_1_name: 'Sunpowered Yachts',
    deal_1_story: '120 SunPower panels, shipped internationally from France to Miami, Florida. End-to-end ownership of the deal: quotation, negotiation, logistics, shipping organisation.',
    deal_2_route: 'Lille → France',
    deal_2_name: 'EURL FCE28',
    deal_2_story: 'Domestic enterprise account. A different funnel: longer cycle, technical discussion, supplier coordination. Same outcome.',

    /* ── 06. FASEP ── */
    fasep_chapter: 'Chapter IV',
    fasep_when: 'Oct 17 — Nov 1, 2025',
    fasep_title: 'A two-week mission to <em>Southern Africa</em>.',
    fasep_lead: 'Planet Soar was bidding on a European Union <strong>FASEP public-sector contract</strong> in Southern Africa. The bid needed local partners on the ground.',
    fasep_p1: 'I flew to Gaborone and Johannesburg. Two weeks of meetings, site visits, partnership conversations. By the end, we had secured <strong>Solar Power Kgalagadi Resources Development Co.</strong> as the local partner underpinning the bid.',
    fasep_aside: 'It is the part of the job that is rarely on the e-commerce manager\'s brief. I think that\'s why it matters.',

    /* ── 07. WHAT I BRING ── */
    bring_chapter: 'Chapter V',
    bring_title: 'What I bring to <em>your</em> next thing.',
    bring_col1_title: 'The Stack',
    bring_col2_title: 'The Range',
    bring_col3_title: 'The Edges',

    /* ── 08. CONTACT ── */
    contact_pre: 'If you\'ve made it this far',
    contact_cta: 'Let\'s <em>talk</em>.',
    contact_cv: 'Download CV (PDF)',

    /* ── FOOTER ── */
    foot_built: 'Built in Lille. Hosted on Vercel.',

    /* ── PORTRAIT ALT ── */
    portrait_alt: 'Melvyn Cross',
    portrait_placeholder: 'Add portrait.jpg to /img/',
  },

  fr: {
    /* ── NAV ── */
    nav_location: '<span class="nav__dot"></span>Lille → Royaume-Uni',

    /* ── 01. HERO ── */
    hero_label: 'Un builder e-commerce, en transit.',
    hero_word_1: 'Melvyn',
    hero_word_2: '<em>Cross</em>',
    hero_caption_1: 'J\'ai passé six ans à construire une boutique Shopify de zéro jusqu\'à <strong>1&nbsp;600&nbsp;000&nbsp;€</strong> de chiffre d\'affaires annuel en Europe.',
    hero_caption_2: 'Je cherche maintenant le prochain projet.',

    /* ── 02. THE NUMBER ── */
    number_label: 'Le résultat, avant l\'histoire',
    number_year: 'Nov 2020 → Sept 2026',
    number_target: 1600000,
    number_caption: 'Chiffre d\'affaires annuel moyen de <em>planetsoarshop.com</em>, un e-commerce photovoltaïque que j\'ai construit et géré en tant que seul responsable e-commerce.',

    /* ── 03. THE BEGINNING ── */
    beginning_chapter: 'Chapitre I',
    beginning_chapter_name: 'Le Début',
    beginning_title: 'Novembre <em>2020</em>.',
    beginning_lead: 'Pas de boutique. Pas de catalogue. Pas de fournisseurs. Une entreprise qui voulait vendre du solaire en ligne et ne savait pas encore comment.',
    beginning_p1: 'J\'ai rejoint Planet Soar en tant que responsable e-commerce. En quelques mois, un contrat temporaire est devenu une alternance, et cette alternance est devenue la construction de <em>planetsoarshop.com</em>. Ce qui a commencé comme un canal secondaire est devenu le moteur commercial de l\'entreprise.',
    beginning_p2: 'Six ans plus tard, le canal en ligne représente <strong>60 % du chiffre d\'affaires</strong> et génère <strong>100 % de la demande entrante</strong>. C\'est une histoire de croissance, mais aussi de <em>protection</em> de ce qui fonctionne pendant que tout change autour.',

    /* ── 04. WHAT I BUILT ── */
    built_chapter: 'Chapitre II',
    built_title: 'Ce que <em>j\'ai</em> construit.',
    built_intro: 'Une boutique Shopify avec 544 SKU actifs au pic, approvisionnée par neuf fournisseurs européens, soutenue par un moteur de livraison sur mesure, et gérée par une équipe de sept personnes.',
    stat_1_label: 'SKU au pic du catalogue',
    stat_1_note: 'Panneaux, batteries, onduleurs, bornes de recharge, accessoires. Cinq catégories, chacune avec ses propres contraintes logistiques.',
    stat_2_label: 'Fournisseurs européens intégrés',
    stat_2_note: 'ENECSOL, VOLTANEO, KRANNICH, BAYWARE, ESTG, POWR CONNECT, ALLIANTZ, plus deux partenaires ponctuels en Suisse et en Italie.',
    stat_3_label: 'Profils de livraison construits manuellement',
    stat_3_note: 'Le problème que personne ne voulait résoudre : la livraison par article chez neuf fournisseurs sans API transporteur. J\'ai construit un modèle de coût interne avec <strong>~90 % de précision</strong>.',
    stat_4_label: 'Impressions organiques quotidiennes au pic',
    stat_4_note: '~500 clics par jour, 2,5 % de CTR. 100 % SEO organique. Le payant était réservé aux lancements de produits et aux pics saisonniers.',
    stat_5_label: 'Personnes dans l\'équipe',
    stat_5_note: 'Cinq commerciaux, un assistant e-commerce, plus la supervision de la fonction comptable. KPIs, cadence de reporting, conception de processus.',
    stat_6_label: 'Chiffre d\'affaires via le canal en ligne',
    stat_6_note: 'Tunnel de devis au-dessus de 7 000 €. Conversion directe en dessous. Une répartition délibérée pour un catalogue à panier élevé, pas un contournement.',

    /* ── 05. THE DEALS ── */
    deals_chapter: 'Chapitre III',
    deals_title: 'Deux deals <em>que j\'ai</em> conclus.',
    deal_1_route: 'Lille → Miami',
    deal_1_name: 'Sunpowered Yachts',
    deal_1_story: '120 panneaux SunPower, expédiés internationalement de France à Miami, en Floride. Pilotage de bout en bout : devis, négociation, logistique, organisation de l\'expédition.',
    deal_2_route: 'Lille → France',
    deal_2_name: 'EURL FCE28',
    deal_2_story: 'Compte entreprise domestique. Un cycle différent : plus long, discussions techniques, coordination fournisseurs. Même résultat.',

    /* ── 06. FASEP ── */
    fasep_chapter: 'Chapitre IV',
    fasep_when: '17 oct. — 1er nov. 2025',
    fasep_title: 'Une mission de deux semaines en <em>Afrique australe</em>.',
    fasep_lead: 'Planet Soar répondait à un <strong>appel d\'offres FASEP du secteur public</strong> de l\'Union européenne en Afrique australe. L\'offre nécessitait des partenaires locaux sur le terrain.',
    fasep_p1: 'Je me suis rendu à Gaborone et Johannesburg. Deux semaines de réunions, de visites de sites, de conversations partenariales. Au final, nous avions sécurisé <strong>Solar Power Kgalagadi Resources Development Co.</strong> comme partenaire local pour soutenir l\'offre.',
    fasep_aside: 'C\'est la partie du travail qui figure rarement dans la fiche de poste du responsable e-commerce. C\'est pour ça qu\'elle compte.',

    /* ── 07. WHAT I BRING ── */
    bring_chapter: 'Chapitre V',
    bring_title: 'Ce que j\'apporte à <em>votre</em> prochain projet.',
    bring_col1_title: 'L\'Arsenal',
    bring_col2_title: 'Le Spectre',
    bring_col3_title: 'Les Atouts',

    /* ── 08. CONTACT ── */
    contact_pre: 'Si vous êtes arrivé jusqu\'ici',
    contact_cta: 'Parlons-<em>en</em>.',
    contact_cv: 'Télécharger le CV (PDF)',

    /* ── FOOTER ── */
    foot_built: 'Construit à Lille. Hébergé sur Vercel.',

    /* ── PORTRAIT ALT ── */
    portrait_alt: 'Melvyn Cross',
    portrait_placeholder: 'Ajouter portrait.jpg dans /img/',
  },
};

export default content;
