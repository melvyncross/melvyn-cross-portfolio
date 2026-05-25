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
