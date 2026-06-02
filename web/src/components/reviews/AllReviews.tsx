import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { watchReviews } from '../../lib/firestore';
import type { Review } from '@knowledgeatlas/schemas';

export default function AllReviews({ slugToTitle }: { slugToTitle: Record<string, string> }) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookFilter, setBookFilter] = useState<string>('all');
  useEffect(() => {
    if (!user) return;
    return watchReviews(user.uid, setReviews, () => undefined);
  }, [user]);
  const slugs = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.bookSlug))).sort(),
    [reviews],
  );
  const visible =
    bookFilter === 'all' ? reviews : reviews.filter((r) => r.bookSlug === bookFilter);
  if (!user) {
    return (
      <p className="text-ink-soft">
        <a href="/signin" className="text-terracotta-500">Sign in</a> to see your reviews.
      </p>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
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
        <p className="text-ink-soft text-sm">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((r) => (
            <li key={r.id} className="grain-card grain-overlay p-4">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-mute mb-1">
                <a href={`/books/${r.bookSlug}/reviews`} className="hover:text-terracotta-500">
                  {slugToTitle[r.bookSlug] ?? r.bookSlug}
                </a>
              </p>
              <div className="text-terracotta-500 mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              {r.pros && <p className="text-sm"><span className="text-emerald-600">+ </span>{r.pros}</p>}
              {r.cons && <p className="text-sm mt-1"><span className="text-terracotta-500">– </span>{r.cons}</p>}
              {r.recommendation && <p className="text-sm mt-2 italic text-ink-soft">{r.recommendation}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
