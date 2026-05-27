import { localizedString, localizedText } from './localizedString.js';
import { portfolioContent } from './portfolioContent.js';
import { educationContent } from './educationContent.js';
import { qualificationsContent } from './qualificationsContent.js';
import { contactPageContent } from './contactPageContent.js';
import { blogPageContent } from './blogPageContent.js';
import { post } from './post.js';

export const schemaTypes = [
  localizedString,
  localizedText,
  portfolioContent,
  educationContent,
  qualificationsContent,
  contactPageContent,
  blogPageContent,
  post,
];
