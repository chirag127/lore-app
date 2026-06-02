import { z } from 'zod';

export const BookMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase-kebab slug'),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  authors: z.array(z.string()).min(1),
  isbn13: z.string().optional(),
  isbn10: z.string().optional(),
  olid: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().int().min(0).max(2100).optional(),
  pages: z.number().int().positive().optional(),
  language: z.string().default('en'),
  cover: z
    .object({
      url: z.string().url(),
      source: z.string(),
      color: z.string().optional(),
    })
    .optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'dense']).default('medium'),
  readingTimeMinutes: z.number().int().positive().optional(),
  listeningTimeMinutes: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
});

export type BookMeta = z.infer<typeof BookMetaSchema>;

export const BookFrontmatterSchema = BookMetaSchema.extend({
  excerpt: z.string().min(1),
  whoShouldRead: z.array(z.string()).default([]),
  whoShouldSkip: z.array(z.string()).default([]),
  keyIdeas: z.array(z.string()).min(1),
  keyTakeaways: z.array(z.string()).default([]),
  relatedBooks: z.array(z.string()).default([]),
});

export type BookFrontmatter = z.infer<typeof BookFrontmatterSchema>;

export const NoteSchema = z.object({
  id: z.string(),
  bookSlug: z.string(),
  content: z.string().min(1).max(20_000),
  tags: z.array(z.string()).max(20).default([]),
  pinned: z.boolean().default(false),
  favorite: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  bookSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  pros: z.string().max(5_000).default(''),
  cons: z.string().max(5_000).default(''),
  recommendation: z.string().max(5_000).default(''),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const CollectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(2_000).default(''),
  tags: z.array(z.string()).default([]),
  books: z.array(z.string()).default([]),
  public: z.boolean().default(false),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const ReadingStatus = z.enum([
  'want',
  'reading',
  'finished',
  'abandoned',
]);
export type ReadingStatus = z.infer<typeof ReadingStatus>;

export const ReadingProgressSchema = z.object({
  bookSlug: z.string(),
  status: ReadingStatus,
  percent: z.number().min(0).max(100).default(0),
  startedAt: z.number().optional(),
  finishedAt: z.number().optional(),
  lastPosition: z.string().optional(),
  updatedAt: z.number(),
});

export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;

export const BookmarkSchema = z.object({
  bookSlug: z.string(),
  createdAt: z.number(),
});

export const UserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  narrationVoice: z.string().optional(),
  narrationRate: z.number().min(0.5).max(2).default(1),
  defaultReadingTimeMinutes: z.number().int().positive().default(20),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

export const LLMModelConfigSchema = z.object({
  id: z.string(),
  baseUrl: z.string().url(),
  apiKeyEnv: z.string(),
  model: z.string(),
  headers: z.record(z.string()).optional(),
  maxTokens: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  timeoutMs: z.number().int().positive().default(60_000),
});

export type LLMModelConfig = z.infer<typeof LLMModelConfigSchema>;

export const LLMModelsFileSchema = z.object({
  description: z.string().optional(),
  models: z.array(LLMModelConfigSchema).min(1),
});

export type LLMModelsFile = z.infer<typeof LLMModelsFileSchema>;

export const BookRequestSchema = z.object({
  title: z.string().min(1).max(300),
  author: z.string().min(1).max(300),
  notes: z.string().max(2_000).optional(),
  requester: z.string().email().optional(),
});

export type BookRequest = z.infer<typeof BookRequestSchema>;
