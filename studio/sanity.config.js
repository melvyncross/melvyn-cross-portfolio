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
            // Singleton — one document, always the same _id
            S.listItem()
              .title('Portfolio Content')
              .id('siteContent')
              .child(
                S.document()
                  .schemaType('portfolioContent')
                  .documentId('siteContent')
                  .title('Portfolio Content')
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
