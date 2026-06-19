/**
 * Book content collection. Books live in `mdx/<category>/<subcategory>/<leaf>/<slug>/`,
 * each with a meta.json + four MDX files (01-index, 02-content, 03-analysis,
 * 04-narration). For now we expose the meta.json catalog as a simple typed
 * collection used for listing pages and the per-book overview page; the four
 * MDX bodies render via Astro's content collection MDX loader on demand.
 *
 * The schema is intentionally permissive — author files have grown organically
 * and we accept missing optional fields rather than fail the build.
 */
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const flexAuthor = z.union([
  z.string(),
  z
    .object({ name: z.string() })
    .passthrough()
    .transform((o) => o.name),
])

const coverSchema = z
  .union([
    z.string().url(),
    z.object({
      url: z.string().url(),
      source: z.string().optional(),
      color: z.string().optional(),
    }),
  ])
  .transform((c) =>
    typeof c === 'string'
      ? { url: c, source: 'openlibrary' as const }
      : { source: 'openlibrary' as const, ...c },
  )

const keyIdeaSchema = z
  .union([
    z.string(),
    z.object({
      title: z.string(),
      description: z.string().nullish(),
    }),
  ])
  .transform((k) =>
    typeof k === 'string' ? k : k.description ? `${k.title} — ${k.description}` : k.title,
  )

const overview = defineCollection({
  loader: glob({ pattern: '**/01-index.mdx', base: './mdx' }),
  schema: z.object({ title: z.string().default('') }).passthrough(),
})
const content = defineCollection({
  loader: glob({ pattern: '**/02-content.mdx', base: './mdx' }),
  schema: z.object({ title: z.string().default('') }).passthrough(),
})
const analysis = defineCollection({
  loader: glob({ pattern: '**/03-analysis.mdx', base: './mdx' }),
  schema: z.object({ title: z.string().default('') }).passthrough(),
})
const narration = defineCollection({
  loader: glob({ pattern: '**/04-narration.mdx', base: './mdx' }),
  schema: z.object({ title: z.string().default('') }).passthrough(),
})

export const collections = {
  overview,
  content,
  analysis,
  narration,
  books: defineCollection({
    loader: glob({ pattern: '**/meta.json', base: './mdx' }),
    schema: z
      .object({
        slug: z.string(),
        title: z.string(),
        subtitle: z.string().nullish(),
        authors: z.array(flexAuthor).default([]),
        author: z
          .union([
            z.string(),
            z.array(flexAuthor).transform((arr) => arr.join(', ')),
            z
              .object({})
              .passthrough()
              .transform((o) => {
                const obj = o as Record<string, unknown>
                const pick = obj.name ?? obj.primary ?? obj.first
                return typeof pick === 'string' ? pick : undefined
              }),
          ])
          .nullish(),
        isbn13: z.string().nullish(),
        isbn10: z.string().nullish(),
        cover: coverSchema.nullish(),
        coverUrl: z.string().nullish(),
        year: z.coerce.number().int().nullish(),
        publicationYear: z.coerce.number().int().nullish(),
        publisher: z
          .union([
            z.string(),
            z
              .object({})
              .passthrough()
              .transform((o) => {
                const obj = o as Record<string, unknown>
                const pick =
                  obj.name ?? obj.english_us ?? obj.english_uk ?? obj.english ?? obj.original
                return typeof pick === 'string' ? pick : undefined
              }),
          ])
          .nullish(),
        pages: z.coerce.number().int().nullish(),
        language: z.string().default('en'),
        difficulty: z
          .union([z.string(), z.number()])
          .transform((v) => (typeof v === 'number' ? String(v) : v))
          .default('medium'),
        readingTimeMinutes: z.coerce.number().int().nullish(),
        listeningTimeMinutes: z.coerce.number().int().nullish(),
        estimatedReadingHours: z.coerce.number().nullish(),
        tags: z.array(z.string()).default([]),
        genres: z.array(z.string()).optional(),
        subjects: z.array(z.string()).optional(),
        themes: z.array(z.string()).optional(),
        category: z
          .union([z.string(), z.array(z.string())])
          .nullish()
          .transform((v) => (Array.isArray(v) ? v[0] : (v ?? undefined))),
        subcategory: z
          .union([z.string(), z.array(z.string())])
          .nullish()
          .transform((v) => (Array.isArray(v) ? v[0] : (v ?? undefined))),
        subtopic: z
          .union([z.string(), z.array(z.string())])
          .nullish()
          .transform((v) => (Array.isArray(v) ? v[0] : (v ?? undefined))),
        excerpt: z.string().default(''),
        whoShouldRead: z.array(z.string()).default([]),
        whoShouldSkip: z.array(z.string()).default([]),
        keyIdeas: z.array(keyIdeaSchema).default([]),
        keyTakeaways: z.array(z.string()).default([]),
        addedAt: z.number().int().optional(),
      })
      .passthrough()
      .transform((raw) => {
        const authorList =
          raw.authors && raw.authors.length
            ? raw.authors
            : raw.author
              ? raw.author
                  .split(/\s*(?:,| and |&)\s*/i)
                  .map((s) => s.trim())
                  .filter(Boolean)
              : []
        const year = raw.year ?? raw.publicationYear
        const tags =
          (raw.tags?.length ?? 0) > 0
            ? raw.tags
            : [...(raw.genres ?? []), ...(raw.subjects ?? []), ...(raw.themes ?? [])]
        const readingTimeMinutes =
          raw.readingTimeMinutes ??
          (raw.estimatedReadingHours ? Math.round(raw.estimatedReadingHours * 60) : undefined)
        return {
          slug: raw.slug,
          title: raw.title,
          subtitle: raw.subtitle ?? undefined,
          authors: authorList,
          isbn13: raw.isbn13 ?? undefined,
          isbn10: raw.isbn10 ?? undefined,
          cover: raw.cover ?? undefined,
          year: year ?? undefined,
          publisher: raw.publisher ?? undefined,
          pages: raw.pages ?? undefined,
          language: raw.language,
          difficulty: raw.difficulty,
          readingTimeMinutes,
          listeningTimeMinutes: raw.listeningTimeMinutes ?? undefined,
          tags,
          category: raw.category,
          subcategory: raw.subcategory,
          subtopic: raw.subtopic,
          excerpt: raw.excerpt,
          whoShouldRead: raw.whoShouldRead,
          whoShouldSkip: raw.whoShouldSkip,
          keyIdeas: raw.keyIdeas,
          keyTakeaways: raw.keyTakeaways,
          addedAt: raw.addedAt,
        }
      }),
  }),
}
