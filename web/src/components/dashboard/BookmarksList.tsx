import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { watchBookmarks } from '../../lib/firestore';
import { useLibraryStore } from '../../lib/stores/library';

export function BookmarksList({ allBooks }: { allBooks: Array<{ slug: string; data: { title: string } }> }) {
  const user = useAuthStore((s) => s.user);
  const recent = useLibraryStore((s) => s.recent);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;
    return watchBookmarks(user.uid, setBookmarks, () => undefined);
  }, [user]);

  const titleBySlug = new Map(allBooks.map((b) => [b.slug, b.data.title]));
  const titles = [
    ...bookmarks.map((s) => ({ slug: s, title: titleBySlug.get(s) ?? s, source: 'bookmark' as const })),
    ...recent.map((s) => ({ slug: s, title: titleBySlug.get(s) ?? s, source: 'recent' as const })),
  ];
  const seen = new Set<string>();
  const uniq = titles.filter((t) => (seen.has(t.slug) ? false : (seen.add(t.slug), true)));

  if (uniq.length === 0) {
    return <p className="text-ink-soft text-sm">Nothing here yet. Bookmark a book to keep it close.</p>;
  }
  return (
    <ul className="space-y-2">
      {uniq.map((t) => (
        <li key={`${t.source}-${t.slug}`}>
          <a
            href={`/books/${t.slug}`}
            className="group flex items-center gap-3 sm:gap-4 p-3 -mx-3 sm:mx-0 rounded-sm hover:bg-paper-deep transition-colors"
          >
            <span className="truncate flex-1 min-w-0 font-display text-base font-light group-hover:text-terracotta-500 transition-colors">
              {t.title}
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-mute flex-shrink-0">
              {t.source}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
