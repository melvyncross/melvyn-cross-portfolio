// Sanity schema for the Qualifications page singleton.
// _id = "qualificationsContent". All text content for /qualifications lives here.

export const qualificationsContent = {
  name: 'qualificationsContent',
  title: 'Qualifications Page',
  type: 'document',
  fields: [

    // ── HERO ─────────────────────────────────────────────────────────────
    {
      name: 'qua_hero_pre',
      title: 'Hero — Pre-text',
      type: 'localizedString',
      description: 'e.g. Professional credentials',
    },
    {
      name: 'qua_hero_title',
      title: 'Hero — Title (HTML OK)',
      type: 'localizedString',
      description: 'e.g. My <em>qualifications</em>.',
    },
    {
      name: 'qua_hero_sub',
      title: 'Hero — Subtitle',
      type: 'localizedText',
    },
    {
      name: 'qua_hero_stat1_num',
      title: 'Hero — Stat 1 number',
      type: 'localizedString',
      description: 'e.g. 2',
    },
    {
      name: 'qua_hero_stat1_txt',
      title: 'Hero — Stat 1 label',
      type: 'localizedString',
      description: 'e.g. Active certifications',
    },
    {
      name: 'qua_hero_stat2_num',
      title: 'Hero — Stat 2 number',
      type: 'localizedString',
      description: 'e.g. 1',
    },
    {
      name: 'qua_hero_stat2_txt',
      title: 'Hero — Stat 2 label',
      type: 'localizedString',
      description: 'e.g. In progress',
    },
    {
      name: 'qua_hero_stat3_num',
      title: 'Hero — Stat 3 number',
      type: 'localizedString',
      description: 'e.g. 3+',
    },
    {
      name: 'qua_hero_stat3_txt',
      title: 'Hero — Stat 3 label',
      type: 'localizedString',
      description: 'e.g. Platforms covered',
    },

    // ── HUBSPOT ──────────────────────────────────────────────────────────
    {
      name: 'qua_hs_name',
      title: 'HubSpot — Certification name',
      type: 'localizedString',
      description: 'e.g. Digital Marketing Certified',
    },
    {
      name: 'qua_hs_skills',
      title: 'HubSpot — Skills (comma-separated)',
      type: 'localizedText',
      description: 'e.g. CRM Management, Lead Nurturing, Email Marketing',
    },

    // ── GOOGLE ANALYTICS ─────────────────────────────────────────────────
    {
      name: 'qua_ga_name',
      title: 'Google Analytics — Certification name',
      type: 'localizedString',
      description: 'e.g. Google Analytics (GA4) Certification',
    },
    {
      name: 'qua_ga_skills',
      title: 'Google Analytics — Skills (comma-separated)',
      type: 'localizedText',
      description: 'e.g. GA4, Conversion Tracking, Audience Analysis',
    },

    // ── PMI ───────────────────────────────────────────────────────────────
    {
      name: 'qua_pmi_name',
      title: 'PMI — Certification name',
      type: 'localizedString',
      description: 'e.g. PMI Project Management Professional',
    },
    {
      name: 'qua_pmi_status',
      title: 'PMI — Status label',
      type: 'localizedString',
      description: 'e.g. Coming soon',
    },
    {
      name: 'qua_pmi_skills',
      title: 'PMI — Skills (comma-separated)',
      type: 'localizedText',
      description: 'e.g. Project Planning, Risk Management, Agile / Scrum',
    },
  ],

  preview: {
    prepare() {
      return { title: 'Qualifications Page (singleton)' };
    },
  },
};
