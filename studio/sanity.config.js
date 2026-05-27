import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas/index.js';

export default defineConfig({
  name: 'melvyn-cross-portfolio',
  title: 'Melvyn Cross — Portfolio',

  projectId: 'p4gxllem',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── PAGE SINGLETONS ──────────────────────────────────────────
            S.listItem()
              .title('Homepage')
              .id('siteContent')
              .child(
                S.document()
                  .schemaType('portfolioContent')
                  .documentId('siteContent')
                  .title('Homepage')
              ),
            S.listItem()
              .title('Education Page')
              .id('educationContent')
              .child(
                S.document()
                  .schemaType('educationContent')
                  .documentId('educationContent')
                  .title('Education Page')
              ),
            S.listItem()
              .title('Qualifications Page')
              .id('qualificationsContent')
              .child(
                S.document()
                  .schemaType('qualificationsContent')
                  .documentId('qualificationsContent')
                  .title('Qualifications Page')
              ),
            S.listItem()
              .title('Contact Page')
              .id('contactPageContent')
              .child(
                S.document()
                  .schemaType('contactPageContent')
                  .documentId('contactPageContent')
                  .title('Contact Page')
              ),
            S.listItem()
              .title('Blog Page (The Dispatch)')
              .id('blogPageContent')
              .child(
                S.document()
                  .schemaType('blogPageContent')
                  .documentId('blogPageContent')
                  .title('Blog Page (The Dispatch)')
              ),
            S.divider(),
            // ── BLOG POSTS ───────────────────────────────────────────────
            S.listItem()
              .title('Blog Posts')
              .schemaType('post')
              .child(
                S.documentList()
                  .title('Blog Posts')
                  .schemaType('post')
                  .filter('_type == "post"')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
