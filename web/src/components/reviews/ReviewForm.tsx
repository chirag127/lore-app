import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import {
  watchReviews,
  upsertReview,
  deleteReview,
  watchPublicReviews,
} from '../../lib/firestore';
import { useToasts } from '../ui/Toast';
import { Button } from '../ui/Button';
import type { Review } from '@knowledgeatlas/schemas';

export function ReviewForm({ bookSlug, bookTitle }: { bookSlug: string; bookTitle: string }) {
  const user = useAuthStore((s) => s.user);
  const [rating, setRating] = useState(0);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [publish, setPublish] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const { push } = useToasts();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <div className="text-center py-12 border border-dashed border-rule rounded-sm">
        <p className="text-ink-soft">
          <a href="/signin" className="text-terracotta-500">Sign in</a> to review
          <em> {bookTitle}</em>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (rating === 0) {
            push({ tone: 'error', title: 'Pick a rating' });
            return;
          }
          const now = Date.now();
          const r: Review = {
            id: editing?.id ?? crypto.randomUUID(),
            bookSlug,
            rating,
            pros,
            cons,
            recommendation,
            createdAt: editing?.createdAt ?? now,
            updatedAt: now,
          };
          await upsertReview(user.uid, user.displayName || 'Reader', r, publish);
          push({ tone: 'success', title: publish ? 'Review published' : 'Review saved' });
          setRating(0); setPros(''); setCons(''); setRecommendation(''); setPublish(false);
          setEditing(null);
          setRefreshKey((k) => k + 1);
        }}
        className="grain-card grain-overlay p-5 space-y-4"
      >
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
          {editing ? 'Edit review' : 'Write a review'}
        </p>
        <Stars value={rating} onChange={setRating} />
        <div className="grid sm:grid-cols-2 gap-3">
          <TextArea label="Pros" value={pros} onChange={setPros} rows={4} />
          <TextArea label="Cons" value={cons} onChange={setCons} rows={4} />
        </div>
        <TextArea
          label="Recommendation"
          value={recommendation}
          onChange={setRecommendation}
          rows={3}
          placeholder="Who is this book for, and who should skip it?"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="accent-terracotta-400"
            />
            Publish to the public book page
          </label>
          <div className="flex items-center gap-2">
            {editing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setRating(0); setPros(''); setCons(''); setRecommendation(''); setPublish(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm">
              {editing ? 'Update' : 'Save review'}
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        <div>
          <h3 className="font-display text-2xl font-light mb-4">Your reviews</h3>
          <UserReviews
            key={`u-${refreshKey}`}
            ownerId={user.uid}
            bookSlug={bookSlug}
            onEdit={(r) => {
              setEditing(r);
              setRating(r.rating); setPros(r.pros); setCons(r.cons); setRecommendation(r.recommendation);
            }}
            onDeleted={() => setRefreshKey((k) => k + 1)}
          />
        </div>
        <div>
          <h3 className="font-display text-2xl font-light mb-4">From the community</h3>
          <PublicReviews bookSlug={bookSlug} />
        </div>
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full bg-paper-soft border border-rule rounded-sm p-3 text-sm leading-relaxed focus:border-terracotta-400 outline-none resize-y"
      />
    </label>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className="h-9 w-9 inline-flex items-center justify-center text-terracotta-400 hover:text-terracotta-500"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill={n <= value ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="m12 2 3 7 7 .5-5.5 4.5L18 22l-6-4-6 4 1.5-8L2 9.5 9 9z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 font-mono text-xs text-ink-mute">{value ? `${value}/5` : 'tap to rate'}</span>
    </div>
  );
}

function UserReviews({
  ownerId,
  bookSlug,
  onEdit,
  onDeleted,
}: {
  ownerId: string;
  bookSlug: string;
  onEdit: (r: Review) => void;
  onDeleted: () => void;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { push } = useToasts();
  useEffect(() => {
    return watchReviews(
      ownerId,
      (all) => setReviews(all.filter((r) => r.bookSlug === bookSlug)),
      () => undefined,
      bookSlug,
    );
  }, [ownerId, bookSlug]);
  if (reviews.length === 0) return <p className="text-ink-soft text-sm">No reviews from you yet.</p>;
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="grain-card grain-overlay p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Stars value={r.rating} onChange={() => undefined} />
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(r)}
                className="h-6 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
              >Edit</button>
              <button
                onClick={async () => {
                  if (!confirm('Delete review?')) return;
                  await deleteReview(ownerId, r.id);
                  push({ tone: 'info', title: 'Review deleted' });
                  onDeleted();
                }}
                className="h-6 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
              >Delete</button>
            </div>
          </div>
          {r.pros && <p className="text-sm"><span className="font-medium text-emerald-600">+ </span>{r.pros}</p>}
          {r.cons && <p className="text-sm mt-1"><span className="font-medium text-terracotta-500">– </span>{r.cons}</p>}
          {r.recommendation && <p className="text-sm mt-2 italic text-ink-soft">{r.recommendation}</p>}
        </li>
      ))}
    </ul>
  );
}

function PublicReviews({ bookSlug }: { bookSlug: string }) {
  const [reviews, setReviews] = useState<Array<Review & { authorName?: string }>>([]);
  useEffect(() => {
    return watchPublicReviews(bookSlug, setReviews, () => undefined);
  }, [bookSlug]);
  if (reviews.length === 0) {
    return <p className="text-ink-soft text-sm">No public reviews yet. Be the first.</p>;
  }
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="grain-card grain-overlay p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-paper-deep font-mono text-xs">
                {(r.authorName || '?').slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-sm">{r.authorName}</p>
                <Stars value={r.rating} onChange={() => undefined} />
              </div>
            </div>
          </div>
          {r.pros && <p className="text-sm"><span className="font-medium text-emerald-600">+ </span>{r.pros}</p>}
          {r.cons && <p className="text-sm mt-1"><span className="font-medium text-terracotta-500">– </span>{r.cons}</p>}
          {r.recommendation && <p className="text-sm mt-2 italic text-ink-soft">{r.recommendation}</p>}
        </li>
      ))}
    </ul>
  );
}
