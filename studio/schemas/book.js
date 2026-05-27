/**
 * book.js — Sanity schema for the Reading List
 * Each document = one book recommendation with cover, rating, thoughts, learnings.
 */

export const book = {
  name: 'book',
  title: 'Book',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload the book cover. Portrait orientation (2:3) works best.',
    },
    {
      name: 'amazonUrl',
      title: 'Amazon Buy Link',
      type: 'url',
      description: 'Direct link to the book on Amazon.',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'rating',
      title: 'My Rating (out of 10)',
      type: 'number',
      description: 'A number from 1 to 10.',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Personal Finance',     value: 'finance' },
          { title: 'Personal Development', value: 'development' },
          { title: 'Business',             value: 'business' },
          { title: 'Mindset',              value: 'mindset' },
          { title: 'Other',                value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'myThoughts',
      title: 'My Thoughts',
      type: 'text',
      rows: 4,
      description: 'Your honest take on the book — shown in italic on the card.',
      validation: (Rule) => Rule.required().max(600),
    },
    {
      name: 'whatILearned',
      title: 'What I Learned',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key takeaways — one bullet point per entry. Add 3–6 items.',
      options: { layout: 'list' },
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pin to the top of the reading list.',
      initialValue: false,
    },
    {
      name: 'readAt',
      title: 'When I Read It',
      type: 'string',
      description: 'e.g. Jan 2025 — optional, for context.',
    },
  ],

  orderings: [
    {
      title: 'Featured first, then newest',
      name: 'featuredDesc',
      by: [
        { field: 'featured',   direction: 'desc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
    {
      title: 'Highest rated first',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'author',
      media:    'coverImage',
      rating:   'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title,
        subtitle: `${subtitle}${rating != null ? ` — ${rating}/10` : ''}`,
        media,
      };
    },
  },
};
