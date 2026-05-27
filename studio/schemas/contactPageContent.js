// Sanity schema for the Contact page singleton.
// _id = "contactPageContent". Text content for /contact lives here.

export const contactPageContent = {
  name: 'contactPageContent',
  title: 'Contact Page',
  type: 'document',
  fields: [

    // ── HERO ─────────────────────────────────────────────────────────────
    {
      name: 'cp_hero_pre',
      title: 'Hero — Pre-text',
      type: 'localizedString',
      description: "e.g. Let's connect",
    },
    {
      name: 'cp_hero_title',
      title: 'Hero — Title (HTML OK)',
      type: 'localizedString',
      description: 'e.g. Get in <em>touch</em>.',
    },

    // ── DIRECT CONTACT LINKS ──────────────────────────────────────────────
    {
      name: 'cp_email',
      title: 'Email address (display)',
      type: 'string',
      description: 'e.g. melvyn.cross05@gmail.com',
    },
    {
      name: 'cp_linkedin',
      title: 'LinkedIn handle (display)',
      type: 'string',
      description: 'e.g. /in/melvyn-botlhe',
    },
    {
      name: 'cp_linkedin_url',
      title: 'LinkedIn full URL',
      type: 'string',
      description: 'e.g. https://www.linkedin.com/in/melvyn-botlhe',
    },
    {
      name: 'cp_phone',
      title: 'Phone number (display)',
      type: 'string',
      description: 'e.g. +33 6 22 52 70 79',
    },
    {
      name: 'cp_phone_url',
      title: 'Phone number (tel: link)',
      type: 'string',
      description: 'e.g. +33622527079',
    },
  ],

  preview: {
    prepare() {
      return { title: 'Contact Page (singleton)' };
    },
  },
};
