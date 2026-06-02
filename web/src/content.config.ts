import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authorSchema = z
  .union([
    z.string(),
    z
      .object({ name: z.string() })
      .passthrough()
      .transform((o) => o.name),
  ]);

const flexString = z
  .union([z.string(), z.unknown()])
  .transform((v) => (v == null ? undefined : typeof v === 'string' ? v : JSON.stringify(v)));

const looseAuthorSchema = z
  .union([z.string(), z.array(z.string()), authorSchema])
  .transform((a) => {
    if (typeof a === 'string') return a;
    if (Array.isArray(a)) return a.join(', ');
    return a as string;
  });

const coverSchema = z
  .preprocess(
    (v) => (v == null ? undefined : v),
    z.union([
      z.string().url(),
      z.object({
        url: z.string().url(),
        source: z.string().optional(),
        color: z.string().optional(),
      }),
    ]),
  )
  .transform((c) =>
    typeof c === 'string' ? { url: c, source: 'openlibrary' as const } : { source: 'openlibrary' as const, ...c },
  );

const keyIdeaSchema = z
  .preprocess(
    (v) => (v == null ? undefined : v),
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        description: z.string().nullish().transform((v) => v ?? undefined),
      }),
    ]),
  )
  .transform((k) => (typeof k === 'string' ? k : k.description ? `${k.title} — ${k.description}` : k.title));

const relatedBookSchema = z
  .preprocess(
    (v) => (v == null ? undefined : v),
    z.union([
      z.string(),
      z.object({
        title: z.string().nullish().transform((v) => v ?? ''),
        author: z.string().nullish().transform((v) => v ?? undefined),
        slug: z.string().nullish().transform((v) => v ?? undefined),
        reason: z.string().nullish().transform((v) => v ?? undefined),
      }),
    ]),
  )
  .transform((b) => (typeof b === 'string' ? b : b.title));

const overview = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: '../knowledge' }),
  schema: z
    .object({
      title: z.string().default(''),
      excerpt: z.string().optional(),
    })
    .transform((d) => ({ title: d.title, excerpt: d.excerpt })),
});

const content = defineCollection({
  loader: glob({ pattern: '**/01-content.mdx', base: '../knowledge' }),
  schema: z
    .object({ title: z.string().default('') })
    .transform((d) => ({ title: d.title })),
});

const analysis = defineCollection({
  loader: glob({ pattern: '**/02-analysis.mdx', base: '../knowledge' }),
  schema: z
    .object({ title: z.string().default('') })
    .transform((d) => ({ title: d.title })),
});

const narration = defineCollection({
  loader: glob({ pattern: '**/03-narration.mdx', base: '../knowledge' }),
  schema: z
    .object({ title: z.string().default('') })
    .transform((d) => ({ title: d.title })),
});

export const collections = {
  books: defineCollection({
    loader: glob({ pattern: '**/meta.json', base: '../knowledge' }),
    schema: z
      .object({
        slug: z.string(),
        title: z.string(),
        subtitle: z.string().nullish().transform((v) => v ?? undefined),
        authors: z.array(authorSchema).optional(),
        author: looseAuthorSchema.optional(),
        isbn13: z.string().nullish().transform((v) => v ?? undefined),
        isbn10: z.string().nullish().transform((v) => v ?? undefined),
        isbnAlternate: z.string().nullish().transform((v) => v ?? undefined),
        coverUrl: z.string().nullish().transform((v) => v ?? undefined),
        yearPublished: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        publisherOriginal: z.string().nullish().transform((v) => v ?? undefined),
        olid: z.string().nullish().transform((v) => v ?? undefined),
        publisher: flexString.optional(),
        year: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        publicationYear: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        pages: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        language: z.string().default('en'),
        cover: coverSchema.optional(),
        difficulty: z
          .union([z.string(), z.number()])
          .transform((v) => (typeof v === 'number' ? String(v) : v))
          .default('medium'),
        readingTimeMinutes: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        listeningTimeMinutes: z.coerce.number().int().nullish().transform((v) => v ?? undefined),
        estimatedReadingHours: z.coerce.number().nullish().transform((v) => v ?? undefined),
        estimatedListeningMinutes: z.coerce.number().nullish().transform((v) => v ?? undefined),
        tags: z.array(z.string()).default([]),
        genres: z.array(z.string()).optional(),
        subjects: z.array(z.string()).optional(),
        themes: z.array(z.string()).optional(),
        category: z.union([z.string(), z.array(z.string())]).nullish().transform((v) => {
          if (!v) return undefined;
          if (Array.isArray(v)) return v[0];
          return v;
        }),
        subcategory: z.union([z.string(), z.array(z.string())]).nullish().transform((v) => {
          if (!v) return undefined;
          if (Array.isArray(v)) return v[0];
          return v;
        }),
        subtopic: z.union([z.string(), z.array(z.string())]).nullish().transform((v) => {
          if (!v) return undefined;
          if (Array.isArray(v)) return v[0];
          return v;
        }),
        excerpt: z.string().default(''),
        whoShouldRead: z.array(z.string()).default([]),
        whoShouldSkip: z.array(z.string()).default([]),
        keyIdeas: z.array(keyIdeaSchema).default([]),
        keyTakeaways: z.array(z.string()).default([]),
        relatedBooks: z.array(relatedBookSchema).default([]),
        addedAt: z.number().int().optional(),
      })
      .passthrough()
      .transform((raw) => {
        const authorList = (() => {
          if (raw.authors?.length) return raw.authors;
          if (raw.author) {
            if (typeof raw.author === 'string') {
              return raw.author
                .split(/\s*(?:,| and |&)\s*/i)
                .map((s) => s.trim())
                .filter(Boolean);
            }
            return [raw.author];
          }
          return [];
        })();
        const year = raw.year ?? raw.publicationYear;
        const isbn13 = raw.isbn13 ?? (raw.isbn && typeof raw.isbn === 'string' && raw.isbn.length === 13 ? raw.isbn : undefined);
        const isbn10 = raw.isbn10 ?? (raw.isbn && typeof raw.isbn === 'string' && raw.isbn.length === 10 ? raw.isbn : undefined);
        const readingTimeMinutes =
          raw.readingTimeMinutes ??
          (raw.estimatedReadingHours ? Math.round(raw.estimatedReadingHours * 60) : undefined);
        const listeningTimeMinutes =
          raw.listeningTimeMinutes ?? raw.estimatedListeningMinutes;
        const tags = (raw.tags?.length ?? 0) > 0
          ? raw.tags
          : [...(raw.genres ?? []), ...(raw.subjects ?? []), ...(raw.themes ?? [])];
        return {
          slug: raw.slug,
          title: raw.title,
          subtitle: raw.subtitle,
          authors: authorList,
          isbn13,
          isbn10,
          olid: raw.olid,
          publisher: raw.publisher,
          year,
          pages: raw.pages,
          language: raw.language,
          cover: raw.cover,
          difficulty: raw.difficulty,
          readingTimeMinutes,
          listeningTimeMinutes,
          tags,
          category: raw.category,
          subcategory: raw.subcategory,
          subtopic: raw.subtopic,
          excerpt: raw.excerpt,
          whoShouldRead: raw.whoShouldRead,
          whoShouldSkip: raw.whoShouldSkip,
          keyIdeas: raw.keyIdeas,
          keyTakeaways: raw.keyTakeaways,
          relatedBooks: raw.relatedBooks,
          addedAt: raw.addedAt,
        };
      }),
  }),
  overview,
  content,
  analysis,
  narration,
};
