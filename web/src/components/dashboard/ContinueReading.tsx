import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { watchProgress } from '../../lib/firestore';
import type { ReadingProgress } from '@knowledgeatlas/schemas';

export function ContinueReading() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<ReadingProgress[]>([]);
  useEffect(() => {
    if (!user) return;
    return watchProgress(
      user.uid,
      (all) => setItems(all.filter((p) => p.status === 'reading')),
      () => undefined,
    );
  }, [user]);
  if (!user) return null;
  if (items.length === 0) {
    return (
      <p className="text-ink-soft text-sm">
        Start a book to see it here. Open any book and mark it as
        <em> Reading</em>.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.slice(0, 5).map((p) => (
        <li key={p.bookSlug}>
          <a
            href={`/books/${p.bookSlug}`}
            className="group flex items-center gap-3 sm:gap-4 p-3 -mx-3 sm:mx-0 rounded-sm hover:bg-paper-deep transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-base sm:text-lg font-light truncate group-hover:text-terracotta-500 transition-colors">
                {p.bookSlug.replace(/-/g, ' ')}
              </p>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
                {p.percent}% · in progress
              </p>
            </div>
            <ProgressBar value={p.percent} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-16 sm:w-24 h-1.5 bg-paper-deep overflow-hidden rounded-full flex-shrink-0">
      <div
        className="h-full bg-terracotta-400 transition-all duration-500"
        style={{ width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}
