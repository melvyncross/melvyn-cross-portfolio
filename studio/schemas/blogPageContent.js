// Sanity schema for the Blog/Dispatch page singleton.
// _id = "blogPageContent". Page chrome content for /blog lives here.
// (Individual posts are managed separately via the "post" schema.)

export const blogPageContent = {
  name: 'blogPageContent',
  title: 'Blog Page (The Dispatch)',
  type: 'document',
  fields: [

    // ── HERO ─────────────────────────────────────────────────────────────
    {
      name: 'bl_hero_title',
      title: 'Hero — Title (HTML OK)',
      type: 'localizedString',
      description: 'e.g. Stories &amp; <em>Ideas</em>.',
    },
    {
      name: 'bl_hero_desc',
      title: 'Hero — Description',
      type: 'localizedText',
      description: 'Short paragraph below the title.',
    },

    // ── EDITORIAL SECTION ─────────────────────────────────────────────────
    {
      name: 'editorial',
      title: 'Editorial Section — Why I write these articles',
      type: 'localizedPortableText',
      description: 'Rich text shown below all articles. Explain your passion for the topics and why you follow them closely.',
    },
  ],

  preview: {
    prepare() {
      return { title: 'Blog Page — The Dispatch (singleton)' };
    },
  },
};
