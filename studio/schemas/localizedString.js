// Reusable schema types for EN/FR localized fields.
// localizedString → short phrases, titles, labels
// localizedText   → longer paragraphs (HTML allowed as raw string)

export const localizedString = {
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  options: { collapsible: false },
  fields: [
    { name: 'en', title: '🇬🇧 English', type: 'string' },
    { name: 'fr', title: '🇫🇷 French', type: 'string' },
  ],
};

export const localizedText = {
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  options: { collapsible: false },
  fields: [
    { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
    { name: 'fr', title: '🇫🇷 French', type: 'text', rows: 3 },
  ],
};

// localizedPortableText → rich text (WYSIWYG) with bold, italic, links — EN + FR
export const localizedPortableText = {
  name: 'localizedPortableText',
  title: 'Localized Rich Text',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    {
      name: 'en',
      title: '🇬🇧 English',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists:  [],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link', type: 'object', title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
    },
    {
      name: 'fr',
      title: '🇫🇷 French',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists:  [],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link', type: 'object', title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
    },
  ],
};
