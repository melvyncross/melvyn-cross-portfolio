// Sanity schema for the Education page singleton.
// _id = "educationContent". All text content for /education lives here.

export const educationContent = {
  name: 'educationContent',
  title: 'Education Page',
  type: 'document',
  fields: [

    // ── HERO ─────────────────────────────────────────────────────────────
    {
      name: 'edu_hero_pre',
      title: 'Hero — Pre-text',
      type: 'localizedString',
      description: 'e.g. Academic journey',
    },
    {
      name: 'edu_hero_title',
      title: 'Hero — Title (HTML OK)',
      type: 'localizedString',
      description: 'e.g. My <em>education</em>.',
    },
    {
      name: 'edu_hero_sub',
      title: 'Hero — Subtitle',
      type: 'localizedText',
    },
    {
      name: 'edu_hero_stat1_num',
      title: 'Hero — Stat 1 number',
      type: 'localizedString',
      description: 'e.g. 2',
    },
    {
      name: 'edu_hero_stat1_txt',
      title: 'Hero — Stat 1 label',
      type: 'localizedString',
      description: 'e.g. French institutions',
    },
    {
      name: 'edu_hero_stat2_num',
      title: 'Hero — Stat 2 number',
      type: 'localizedString',
      description: 'e.g. Bac+5',
    },
    {
      name: 'edu_hero_stat2_txt',
      title: 'Hero — Stat 2 label',
      type: 'localizedString',
      description: 'e.g. Highest level',
    },
    {
      name: 'edu_hero_stat3_num',
      title: 'Hero — Stat 3 number',
      type: 'localizedString',
      description: 'e.g. 3 yrs',
    },
    {
      name: 'edu_hero_stat3_txt',
      title: 'Hero — Stat 3 label',
      type: 'localizedString',
      description: 'e.g. Apprenticeship',
    },

    // ── ISG PARIS ────────────────────────────────────────────────────────
    {
      name: 'edu_isg_program',
      title: 'ISG — Programme name',
      type: 'localizedString',
      description: 'e.g. MSc Brand Management & e-Business — Bac+5',
    },
    {
      name: 'edu_isg_dates',
      title: 'ISG — Dates chip',
      type: 'localizedString',
      description: 'e.g. Sept 2024 – Sept 2026',
    },
    {
      name: 'edu_isg_grade',
      title: 'ISG — Grade chip',
      type: 'localizedString',
      description: 'e.g. ~15 / 20',
    },
    {
      name: 'edu_isg_desc1',
      title: 'ISG — Description paragraph 1 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'edu_isg_desc2',
      title: 'ISG — Description paragraph 2 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'edu_isg_opinion',
      title: 'ISG — "My take" quote',
      type: 'localizedText',
    },
    {
      name: 'edu_isg_modules',
      title: 'ISG — Key modules (comma-separated)',
      type: 'localizedText',
      description: 'e.g. Corporate Strategy, Business Development, Digital Transformation',
    },

    // ── IUT DE LENS ──────────────────────────────────────────────────────
    {
      name: 'edu_iut_program',
      title: 'IUT — Programme name',
      type: 'localizedString',
      description: 'e.g. BUT Marketing Digital, e-Business & Entrepreneuriat — Bac+3',
    },
    {
      name: 'edu_iut_dates',
      title: 'IUT — Dates chip',
      type: 'localizedString',
      description: 'e.g. Sept 2021 – Sept 2024',
    },
    {
      name: 'edu_iut_employer',
      title: 'IUT — Employer chip',
      type: 'localizedString',
      description: 'e.g. Planet Soar Shop',
    },
    {
      name: 'edu_iut_desc1',
      title: 'IUT — Description paragraph 1 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'edu_iut_desc2',
      title: 'IUT — Description paragraph 2 (HTML OK)',
      type: 'localizedText',
    },
    {
      name: 'edu_iut_opinion',
      title: 'IUT — "My take" quote',
      type: 'localizedText',
    },
    {
      name: 'edu_iut_modules',
      title: 'IUT — Key modules (comma-separated)',
      type: 'localizedText',
      description: 'e.g. Digital Marketing, SEO / SEA, E-commerce Operations',
    },

    // ── GABORONE SENIOR SECONDARY ────────────────────────────────────────
    {
      name: 'edu_gss_desc',
      title: 'GSS — Description paragraph',
      type: 'localizedText',
    },
  ],

  preview: {
    prepare() {
      return { title: 'Education Page (singleton)' };
    },
  },
};
