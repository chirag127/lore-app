import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { watchNotes } from '../../lib/firestore';
import type { Note } from '@knowledgeatlas/schemas';

export default function AllNotes({ slugToTitle }: { slugToTitle: Record<string, string> }) {
  const user = useAuthStore((s) => s.user);
  const [notes, setNotes] = useState<Note[]>([]);
  const [q, setQ] = useState('');
  const [bookFilter, setBookFilter] = useState<string>('all');
  useEffect(() => {
    if (!user) return;
    return watchNotes(user.uid, setNotes, () => undefined);
  }, [user]);

  const slugs = useMemo(
    () => Array.from(new Set(notes.map((n) => n.bookSlug))).sort(),
    [notes],
  );

  const visible = notes
    .filter((n) => (bookFilter === 'all' ? true : n.bookSlug === bookFilter))
    .filter((n) =>
      q
        ? n.content.toLowerCase().includes(q.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        : true,
    );

  if (!user) {
    return (
      <p className="text-ink-soft">
        <a href="/signin" className="text-terracotta-500">Sign in</a> to see
        your notes.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search all notes…"
          className="h-9 px-3 bg-paper-soft border border-rule rounded-sm text-sm flex-1 min-w-[180px] focus:border-terracotta-400 outline-none"
        />
        <select
          value={bookFilter}
          onChange={(e) => setBookFilter(e.target.value)}
          className="h-9 px-2 bg-paper-soft border border-rule rounded-sm text-sm"
        >
          <option value="all">All books</option>
          {slugs.map((s) => (
            <option key={s} value={s}>{slugToTitle[s] ?? s}</option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? (
        <p className="text-ink-soft text-sm">No notes match.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((n) => (
            <li key={n.id} className="grain-card grain-overlay p-4">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-mute mb-1">
                <a href={`/books/${n.bookSlug}/notes`} className="hover:text-terracotta-500">
                  {slugToTitle[n.bookSlug] ?? n.bookSlug}
                </a>
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{n.content}</p>
              {n.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {n.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-mute border border-rule px-1.5 h-5 inline-flex items-center">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
