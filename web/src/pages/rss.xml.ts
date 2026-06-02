import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const books = (await getCollection('books')).sort(
    (a, b) => (b.data.addedAt ?? 0) - (a.data.addedAt ?? 0),
  );
  return rss({
    title: 'KnowledgeAtlas',
    description: 'The free platform for understanding knowledge.',
    site: context.site ?? 'https://knowledgeatlas.app',
    items: books.slice(0, 50).map((b) => ({
      title: `${b.data.title} — ${b.data.authors[0] ?? ''}`,
      pubDate: new Date((b.data.addedAt ?? Date.now()) * 1000),
      description: b.data.excerpt,
      link: `/books/${b.data.slug}`,
    })),
    customData: '<language>en-us</language>',
  });
}
