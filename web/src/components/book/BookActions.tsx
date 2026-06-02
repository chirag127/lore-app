import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import {
  watchBookmarks,
  toggleBookmark as fsToggle,
  setProgress as fsSetProgress,
  watchPublicReviews,
} from '../../lib/firestore';
import { track } from '../../lib/stores/telemetry';
import { cn } from '../../lib/utils';
import type { ReadingStatus } from '@knowledgeatlas/schemas';

export function BookmarkButton({ slug }: { slug: string }) {
  const user = useAuthStore((s) => s.user);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    return watchBookmarks(
      user.uid,
      (slugs) => setOn(slugs.includes(slug)),
      () => undefined,
    );
  }, [user, slug]);

  if (!user) {
    return (
      <a
        href="/signin"
        className="inline-flex items-center gap-2 h-9 px-3 border border-rule rounded-sm text-sm hover:border-terracotta-400 hover:text-terracotta-500 transition-colors"
      >
        <IconBookmark /> Bookmark
      </a>
    );
  }
  return (
    <button
      onClick={async () => {
        setBusy(true);
        const next = !on;
        setOn(next);
        try {
          await fsToggle(user.uid, slug, next);
          track(next ? 'bookmark_add' : 'bookmark_remove', { slug });
        } finally { setBusy(false); }
      }}
      disabled={busy}
      aria-pressed={on}
      className={cn(
        'inline-flex items-center gap-2 h-9 px-3 border rounded-sm text-sm transition-colors focus-ring',
        on
          ? 'border-terracotta-400 text-terracotta-500 bg-terracotta-50/40'
          : 'border-rule hover:border-terracotta-400 hover:text-terracotta-500',
      )}
    >
      <IconBookmark filled={on} /> {on ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}

export function StatusWidget({ slug, title }: { slug: string; title: string }) {
  const user = useAuthStore((s) => s.user);
  const [status, setStatus] = useState<ReadingStatus | null>(null);
  const [percent, setPercent] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { watchProgressForBook } = await import('../../lib/firestore');
      return watchProgressForBook(
        user.uid,
        slug,
        (p) => {
          if (!active) return;
          setStatus(p?.status ?? null);
          setPercent(p?.percent ?? 0);
        },
        () => undefined,
      );
    })();
    return () => { active = false; };
  }, [user, slug]);

  if (!user) return null;

  const set = async (s: ReadingStatus) => {
    setStatus(s);
    setOpen(false);
    await fsSetProgress(user.uid, slug, { status: s, percent: s === 'finished' ? 100 : percent });
    track('reading_status', { slug, status: s, title });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 px-3 border border-rule rounded-sm text-sm hover:border-terracotta-400 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={cn('inline-block h-2 w-2 rounded-full', dot(status))} />
        {label(status)}
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-48 grain-card grain-overlay p-1 animate-reveal" role="menu">
          {(['want', 'reading', 'finished', 'abandoned'] as const).map((s) => (
            <button
              key={s}
              role="menuitemradio"
              aria-checked={status === s}
              onClick={() => set(s)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm hover:bg-paper-deep transition-colors',
                status === s && 'text-terracotta-500',
              )}
            >
              <span className={cn('inline-block h-2 w-2 rounded-full', dot(s))} />
              {label(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const dot = (s: ReadingStatus | null) =>
  s === 'reading'
    ? 'bg-gold-400'
    : s === 'finished'
    ? 'bg-emerald-500'
    : s === 'abandoned'
    ? 'bg-ink-300'
    : s === 'want'
    ? 'bg-terracotta-400'
    : 'bg-ink-200';
const label = (s: ReadingStatus | null) =>
  s === 'reading'
    ? 'Reading'
    : s === 'finished'
    ? 'Finished'
    : s === 'abandoned'
    ? 'Abandoned'
    : s === 'want'
    ? 'Want to read'
    : 'Add status';

const IconBookmark = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path d="M6 3h12v18l-6-4-6 4z" strokeLinejoin="round" />
  </svg>
);

export function PublicReviewSummary({
  slug,
  onLoaded,
}: {
  slug: string;
  onLoaded?: (avg: number, count: number) => void;
}) {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    return watchPublicReviews(
      slug,
      (reviews) => {
        const n = reviews.length;
        const a = n
          ? reviews.reduce((s, r) => s + r.rating, 0) / n
          : 0;
        setAvg(a);
        setCount(n);
        onLoaded?.(a, n);
      },
      () => undefined,
    );
  }, [slug, onLoaded]);
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-soft">
      <span className="text-terracotta-500">★</span> {avg.toFixed(1)} · {count} review{count === 1 ? '' : 's'}
    </span>
  );
}
