// Sanity schema for the portfolio singleton document.
// One document, _id = "siteContent". All EN/FR content lives here.
// HTML tags (<em>, <strong>, <span>) are stored as raw strings — they render
// as innerHTML on the site. Keep them exactly as shown in the placeholder text.

export const portfolioContent = {
  name: 'portfolioContent',
  title: 'Portfolio Content',
  type: 'document',
  fields: [

    // ── 01 · NAV ─────────────────────────────────────────────────────────
    {
      name: 'nav_location',
      title: '01 · Nav — Location',
      type: 'localizedString',
      description: 'e.g. <span class="nav__dot"></span>Lille → UK',
    },

    // ── 02 · HERO ────────────────────────────────────────────────────────
    {
      name: 'hero_label',
      title: '02 · Hero — Tagline',
      type: 'localizedString',
      description: 'Short one-liner below the name.',
    },
    {
      name: 'hero_word_1',
      title: '02 · Hero — Name word 1',
      type: 'localizedString',
      description: 'e.g. Melvyn',
    },
    {
      name: 'hero_word_2',
      title: '02 · Hero — Name word 2 (HTML OK)',
      type: 'localizedString',
      description: 'e.g. <em>Cross</em>',
    },
    {
      name: 'hero_caption_1',
      title: '02 · Hero — Caption paragraph 1 (HTML OK)',
      type: 'localizedText',
      description: 'First caption paragraph. Use <strong> for bold, <em> for italic.',
    },
    {
      name: 'hero_caption_2',
      title: '02 · Hero — Caption paragraph 2',
      type: 'localizedString',
    },

    // ── 03 · THE NUMBER ──────────────────────────────────────────────────
    {
      name: 'number_label',
      title: '03 · Number — Section label',
      type: 'localizedString',
    },
    {
      name: 'number_year',
      title: '03 · Number — Year range',
      type: 'localizedString',
      description: 'e.g. Nov 2020 → Sept 2026',
    },
    {
      name: 'number_target',
      title: '03 · Number — Revenue target (integer)',
      type: 'number',
      description: 'The animated counter target. e.g. 1600000',
    },
    {
      name: 'number_caption',
      title: '03 · Number — Caption (HTML OK)',
      type: 'localizedText',
    },

    // ── 04 · THE BEGINNING ───────────────────────────────────────────────
    {
      name: 'beginning_chapter',
      title: '04 · Beginning — Chapter label',
      type: 'localizedString',
      description: 'e.g. Chapter I',
    },
    {
      name: 'beginning_chapter_name',
      title: '04 · Beginning — Chapter name',
      type: 'localizedString',
      description: 'e.g. The Beginning',
    },
    {
      name: 'beginning_title',
      title: '04 · Beginning — Section title (HTML OK)',
      type: 'localizedString',
      description: 'e.g. November <em>2020</em>.',
    },
    {
      name: 'beginning_lead',
      title: '04 · Beginning — Lead paragraph',
      type: 'localizedText',
    },
    {
      name: 'beginning_p1',
      title: '04 · Beginning — Paragraph 1 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'beginning_p2',
      title: '04 · Beginning — Paragraph 2 (HTML OK)',
      type: 'localizedText',
    },

    // ── 05 · WHAT I BUILT ────────────────────────────────────────────────
    {
      name: 'built_chapter',
      title: '05 · Built — Chapter label',
      type: 'localizedString',
    },
    {
      name: 'built_title',
      title: '05 · Built — Section title (HTML OK)',
      type: 'localizedString',
    },
    {
      name: 'built_intro',
      title: '05 · Built — Intro paragraph',
      type: 'localizedText',
    },
    // Stats
    { name: 'stat_1_label', title: '05 · Stat 1 — Label', type: 'localizedString' },
    { name: 'stat_1_note', title: '05 · Stat 1 — Note (HTML OK)', type: 'localizedText' },
    { name: 'stat_2_label', title: '05 · Stat 2 — Label', type: 'localizedString' },
    { name: 'stat_2_note', title: '05 · Stat 2 — Note', type: 'localizedText' },
    { name: 'stat_3_label', title: '05 · Stat 3 — Label', type: 'localizedString' },
    { name: 'stat_3_note', title: '05 · Stat 3 — Note (HTML OK)', type: 'localizedText' },
    { name: 'stat_4_label', title: '05 · Stat 4 — Label', type: 'localizedString' },
    { name: 'stat_4_note', title: '05 · Stat 4 — Note', type: 'localizedText' },
    { name: 'stat_5_label', title: '05 · Stat 5 — Label', type: 'localizedString' },
    { name: 'stat_5_note', title: '05 · Stat 5 — Note', type: 'localizedText' },
    { name: 'stat_6_label', title: '05 · Stat 6 — Label', type: 'localizedString' },
    { name: 'stat_6_note', title: '05 · Stat 6 — Note', type: 'localizedText' },

    // ── 06 · THE DEALS ───────────────────────────────────────────────────
    {
      name: 'deals_chapter',
      title: '06 · Deals — Chapter label',
      type: 'localizedString',
    },
    {
      name: 'deals_title',
      title: '06 · Deals — Section title (HTML OK)',
      type: 'localizedString',
    },
    { name: 'deal_1_route', title: '06 · Deal 1 — Route', type: 'localizedString' },
    { name: 'deal_1_name', title: '06 · Deal 1 — Name', type: 'localizedString' },
    { name: 'deal_1_story', title: '06 · Deal 1 — Story', type: 'localizedText' },
    { name: 'deal_2_route', title: '06 · Deal 2 — Route', type: 'localizedString' },
    { name: 'deal_2_name', title: '06 · Deal 2 — Name', type: 'localizedString' },
    { name: 'deal_2_story', title: '06 · Deal 2 — Story', type: 'localizedText' },

    // ── 07 · FASEP ───────────────────────────────────────────────────────
    {
      name: 'fasep_chapter',
      title: '07 · FASEP — Chapter label',
      type: 'localizedString',
    },
    {
      name: 'fasep_when',
      title: '07 · FASEP — Dates',
      type: 'localizedString',
      description: 'e.g. Oct 17 — Nov 1, 2025',
    },
    {
      name: 'fasep_title',
      title: '07 · FASEP — Section title (HTML OK)',
      type: 'localizedString',
    },
    {
      name: 'fasep_lead',
      title: '07 · FASEP — Lead (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'fasep_p1',
      title: '07 · FASEP — Paragraph 1 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'fasep_aside',
      title: '07 · FASEP — Aside quote',
      type: 'localizedText',
    },

    // ── 08 · WHAT I BRING ────────────────────────────────────────────────
    {
      name: 'bring_chapter',
      title: '08 · Bring — Chapter label',
      type: 'localizedString',
    },
    {
      name: 'bring_title',
      title: '08 · Bring — Section title (HTML OK)',
      type: 'localizedString',
    },
    { name: 'bring_col1_title', title: '08 · Bring — Column 1 title', type: 'localizedString' },
    { name: 'bring_col2_title', title: '08 · Bring — Column 2 title', type: 'localizedString' },
    { name: 'bring_col3_title', title: '08 · Bring — Column 3 title', type: 'localizedString' },

    // ── 09 · CONTACT ─────────────────────────────────────────────────────
    {
      name: 'contact_pre',
      title: '09 · Contact — Pre-text',
      type: 'localizedString',
    },
    {
      name: 'contact_cta',
      title: '09 · Contact — CTA (HTML OK)',
      type: 'localizedString',
      description: 'e.g. Let\'s <em>talk</em>.',
    },
    {
      name: 'contact_cv',
      title: '09 · Contact — CV button label',
      type: 'localizedString',
    },

    // ── 10 · FOOTER ──────────────────────────────────────────────────────
    {
      name: 'foot_built',
      title: '10 · Footer — Built line',
      type: 'localizedString',
    },

    // ── 11 · PORTRAIT ────────────────────────────────────────────────────
    {
      name: 'portrait_alt',
      title: '11 · Portrait — Alt text',
      type: 'localizedString',
    },
    {
      name: 'portrait_placeholder',
      title: '11 · Portrait — Placeholder label',
      type: 'localizedString',
    },
  ],

  preview: {
    select: { title: 'number_target' },
    prepare() {
      return { title: 'Portfolio Content (singleton)' };
    },
  },
};
