/**
 * seed-pages.js — Melvyn Cross Portfolio
 *
 * One-time script: creates the four page singleton documents in Sanity
 * pre-filled with the current hardcoded content so the studio isn't empty.
 *
 * Safe to re-run — uses createOrReplace(), so it just overwrites if the
 * document already exists.
 *
 * Usage:
 *   SANITY_READ_TOKEN=<your-token> node scripts/seed-pages.js
 *
 * The token needs write access (Editor or above).
 */

import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'p4gxllem';
const DATASET    = process.env.SANITY_DATASET    || 'production';
const TOKEN      = process.env.SANITY_READ_TOKEN;

if (!TOKEN) {
  console.error('[seed-pages] ❌ SANITY_READ_TOKEN not set.');
  process.exit(1);
}

const client = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  useCdn:     false,
  apiVersion: '2024-01-01',
  token:      TOKEN,
});

// Helper to build a localizedString object
const ls = (en, fr) => ({ _type: 'localizedString', en, fr: fr || en });
// Helper to build a localizedText object
const lt = (en, fr) => ({ _type: 'localizedText', en, fr: fr || en });

const documents = [

  // ── EDUCATION PAGE ────────────────────────────────────────────────────────
  {
    _id:   'educationContent',
    _type: 'educationContent',

    edu_hero_pre:      ls('Academic journey'),
    edu_hero_title:    ls('My <em>education</em>.'),
    edu_hero_sub:      lt('From Botswana to Paris — a path built on curiosity, commerce, and three years of learning inside a live business.'),
    edu_hero_stat1_num: ls('2'),
    edu_hero_stat1_txt: ls('French institutions'),
    edu_hero_stat2_num: ls('Bac+5'),
    edu_hero_stat2_txt: ls('Highest level'),
    edu_hero_stat3_num: ls('3 yrs'),
    edu_hero_stat3_txt: ls('Apprenticeship'),

    edu_isg_program: ls('MSc Brand Management &amp; e-Business — Bac+5'),
    edu_isg_dates:   ls('Sept 2024 – Sept 2026'),
    edu_isg_grade:   ls('~15 / 20'),
    edu_isg_desc1:   lt("A Bac+5 programme at one of France's leading business schools, centred on building brand strategy and e-business capability in an international environment. The curriculum bridges classical management thinking with the full stack of modern digital commerce — from corporate strategy down to conversion optimisation and no-code tooling."),
    edu_isg_desc2:   lt('My thesis project is a complete business plan for a new B2C e-commerce venture, beginning from a €15,000 capital position — applying every module in a real decision-making context.'),
    edu_isg_opinion: lt("ISG gave me a vocabulary I was missing. Not just e-commerce tactics, but brand architecture, long-term positioning, and the strategic thinking that separates businesses that scale from ones that plateau. I apply it every time I'm deciding whether to chase a short-term margin or protect a brand signal."),
    edu_isg_modules: lt('Corporate Strategy, Business Development, Digital Transformation, Cross-Channel Strategy, Conversion & Retention, No-Code Tools, MIS, Brand Architecture, E-Business Strategy'),

    edu_iut_program:  ls('BUT Marketing Digital, e-Business &amp; Entrepreneuriat — Bac+3'),
    edu_iut_dates:    ls('Sept 2021 – Sept 2024'),
    edu_iut_employer: ls('Planet Soar Shop'),
    edu_iut_desc1:    lt('A three-year work-study degree combining rigorous academic marketing with a full-time apprenticeship at Planet Soar Shop. From day one, every concept had a live application — managing SEO, running paid campaigns, and operating e-commerce at scale, all while earning the degree.'),
    edu_iut_desc2:    lt('This is where the foundation was built that eventually took Planet Soar Shop from start-up to €1.6M in annual revenue. Not in simulation. In production.'),
    edu_iut_opinion:  lt("The alternance stripped away the safety net. Every model I built on a Monday was pressure-tested by Thursday's results. It taught me that the fastest way to truly learn something is to have real consequences attached — and that instinct for reading performance data quickly is still what I rely on most today."),
    edu_iut_modules:  lt('Digital Marketing, SEO / SEA, E-commerce Operations, Entrepreneurship, Data Analytics, Content Strategy, Brand Management, UX & CRO, Project Management'),

    edu_gss_desc: lt('International secondary education completed in Botswana before relocating to France for higher studies. Growing up navigating two continents — Africa and Europe — built an instinct for adapting across markets, cultures, and communication styles that I carry into every professional context today.'),
  },

  // ── QUALIFICATIONS PAGE ───────────────────────────────────────────────────
  {
    _id:   'qualificationsContent',
    _type: 'qualificationsContent',

    qua_hero_pre:      ls('Professional credentials'),
    qua_hero_title:    ls('My <em>qualifications</em>.'),
    qua_hero_sub:      lt('Certified skills that back the work — from CRM management and analytics to project delivery. Plus one more on the way.'),
    qua_hero_stat1_num: ls('2'),
    qua_hero_stat1_txt: ls('Active certifications'),
    qua_hero_stat2_num: ls('1'),
    qua_hero_stat2_txt: ls('In progress'),
    qua_hero_stat3_num: ls('3+'),
    qua_hero_stat3_txt: ls('Platforms covered'),

    qua_hs_name:   ls('Digital Marketing Certified'),
    qua_hs_skills: lt('CRM Management, Lead Nurturing, Email Marketing, Sales Pipeline, Inbound Strategy, Contact Segmentation'),

    qua_ga_name:   ls('Google Analytics (GA4) Certification'),
    qua_ga_skills: lt('GA4, Conversion Tracking, Audience Analysis, E-commerce Reports, UTM Parameters, Data Studio'),

    qua_pmi_name:   ls('PMI Project Management Professional'),
    qua_pmi_status: ls('Coming soon'),
    qua_pmi_skills: lt('Project Planning, Risk Management, Agile / Scrum, Stakeholder Mgmt, Budget Control, Sprint Planning'),
  },

  // ── CONTACT PAGE ──────────────────────────────────────────────────────────
  {
    _id:   'contactPageContent',
    _type: 'contactPageContent',

    cp_hero_pre:   ls("Let's connect"),
    cp_hero_title: ls('Get in <em>touch</em>.'),

    cp_email:        'melvyn.cross05@gmail.com',
    cp_linkedin:     '/in/melvyn-botlhe',
    cp_linkedin_url: 'https://www.linkedin.com/in/melvyn-botlhe',
    cp_phone:        '+33 6 22 52 70 79',
    cp_phone_url:    '+33622527079',
  },

  // ── BLOG PAGE ─────────────────────────────────────────────────────────────
  {
    _id:   'blogPageContent',
    _type: 'blogPageContent',

    bl_hero_title: ls('Stories &amp; <em>Ideas</em>.'),
    bl_hero_desc:  lt("Where I write about e-commerce strategy, what AI is actually changing, and what the market is doing when no one's looking."),
  },
];

async function main() {
  console.log(`[seed-pages] Seeding ${documents.length} documents into ${PROJECT_ID}/${DATASET}…\n`);

  for (const doc of documents) {
    try {
      await client.createOrReplace(doc);
      console.log(`[seed-pages] ✅ ${doc._id}`);
    } catch (err) {
      console.error(`[seed-pages] ❌ ${doc._id} — ${err.message}`);
    }
  }

  console.log('\n[seed-pages] Done. Open Sanity studio and the documents will be pre-filled.');
}

main().catch(err => {
  console.error('[seed-pages]', err.message);
  process.exit(1);
});
