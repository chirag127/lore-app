import type { ResearchOutput } from '../llm/research';

const OL_SEARCH = (q: string) =>
  `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`;
const OL_COVER = (id: number | string, size: 'L' | 'M' | 'S' = 'L') =>
  `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`;

export interface BookMetadata {
  title: string;
  authors: string[];
  isbn13?: string;
  isbn10?: string;
  olid?: string;
  publisher?: string;
  year?: number;
  pages?: number;
  cover?: { url: string; source: string; color?: string };
  difficulty: 'easy' | 'medium' | 'hard' | 'dense';
  tags: string[];
  readingTimeMinutes?: number;
  listeningTimeMinutes?: number;
}

export async function fetchOpenLibraryMetadata(
  title: string,
  author: string,
): Promise<BookMetadata> {
  const url = OL_SEARCH(`${title} ${author}`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'KnowledgeAtlas-Pipeline/0.1 (+https://knowledgeatlas.app)' },
  });
  if (!res.ok) throw new Error(`Open Library HTTP ${res.status}`);
  const data = (await res.json()) as {
    docs?: Array<{
      title?: string;
      author_name?: string[];
      first_publish_year?: number;
      publisher?: string[];
      number_of_pages_median?: number;
      cover_i?: number;
      isbn?: string[];
      olid?: string[];
      subject?: string[];
    }>;
  };
  const doc = data.docs?.[0];
  if (!doc) {
    return {
      title,
      authors: [author],
      difficulty: 'medium',
      tags: [],
    };
  }
  const isbns = (doc.isbn ?? []).filter((x) => /^\d{10,13}$/.test(x));
  const isbn13 = isbns.find((x) => x.length === 13);
  const isbn10 = isbns.find((x) => x.length === 10);
  const cover = doc.cover_i
    ? { url: OL_COVER(doc.cover_i, 'L'), source: 'Open Library' }
    : undefined;
  return {
    title: doc.title ?? title,
    authors: doc.author_name ?? [author],
    isbn13,
    isbn10,
    olid: doc.olid?.[0],
    publisher: doc.publisher?.[0],
    year: doc.first_publish_year,
    pages: doc.number_of_pages_median,
    cover,
    difficulty: 'medium',
    tags: (doc.subject ?? []).slice(0, 8),
  };
}

export function estimateReadingTime(text: string): number {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
}

export function estimateListeningTime(text: string): number {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 160));
}

export function difficultyFromResearch(r: ResearchOutput): BookMetadata['difficulty'] {
  const len = r.coreArguments.length + r.frameworks.length;
  if (len > 14) return 'dense';
  if (len > 9) return 'hard';
  if (len > 4) return 'medium';
  return 'easy';
}
