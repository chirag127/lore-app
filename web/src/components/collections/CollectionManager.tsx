import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import {
  watchCollections,
  upsertCollection,
  deleteCollection,
} from '../../lib/firestore';
import { useToasts } from '../ui/Toast';
import { Button } from '../ui/Button';
import type { Collection } from '@knowledgeatlas/schemas';

export function CollectionManager({
  allBooks,
}: {
  allBooks: Array<{ slug: string; title: string }>;
}) {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<Collection | null>(null);
  const { push } = useToasts();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    return watchCollections(user.uid, setItems, () => undefined);
  }, [user, refreshKey]);

  if (!user) {
    return (
      <p className="text-ink-soft text-sm">
        <a href="/signin" className="text-terracotta-500">Sign in</a> to create
        collections.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <CollectionForm
        allBooks={allBooks}
        editing={editing}
        onSaved={() => {
          setEditing(null);
          setRefreshKey((k) => k + 1);
          push({ tone: 'success', title: 'Collection saved' });
        }}
        onCancel={() => setEditing(null)}
        userId={user.uid}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <p className="text-ink-soft text-sm col-span-full">
            You haven't curated a list yet. Try grouping your favorite psychology
            books.
          </p>
        ) : (
          items.map((c) => (
            <article key={c.id} className="grain-card grain-overlay p-4 sm:p-5">
              <header className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg sm:text-xl font-light leading-tight">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditing(c)}
                    className="h-8 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
                  >Edit</button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${c.title}"?`)) return;
                      await deleteCollection(user.uid, c.id);
                      push({ tone: 'info', title: 'Collection deleted' });
                      setRefreshKey((k) => k + 1);
                    }}
                    className="h-8 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
                  >Delete</button>
                </div>
              </header>
              <ul className="space-y-1.5">
                {c.books.slice(0, 8).map((slug) => {
                  const b = allBooks.find((x) => x.slug === slug);
                  return (
                    <li key={slug}>
                      <a
                        href={`/books/${slug}`}
                        className="block text-sm text-ink-soft hover:text-terracotta-500 transition-colors truncate"
                      >
                        <span className="text-ink-mute mr-2">·</span>
                        {b?.title ?? slug}
                      </a>
                    </li>
                  );
                })}
                {c.books.length > 8 && (
                  <li className="text-xs text-ink-mute">+ {c.books.length - 8} more</li>
                )}
              </ul>
              {c.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center h-5 px-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-mute border border-rule"
                    >{t}</span>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function CollectionForm({
  allBooks,
  editing,
  onSaved,
  onCancel,
  userId,
}: {
  allBooks: Array<{ slug: string; title: string }>;
  editing: Collection | null;
  onSaved: () => void;
  onCancel: () => void;
  userId: string;
}) {
  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [tags, setTags] = useState(editing?.tags.join(', ') ?? '');
  const [books, setBooks] = useState<string[]>(editing?.books ?? []);
  const [isPublic, setIsPublic] = useState(editing?.public ?? false);
  const { push } = useToasts();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim() || books.length === 0) {
          push({ tone: 'error', title: 'Title and at least one book required' });
          return;
        }
        const now = Date.now();
        const c: Collection = {
          id: editing?.id ?? crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          tags: tags
            .split(/[,\s]+/)
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
          books,
          public: isPublic,
          ownerId: userId,
          createdAt: editing?.createdAt ?? now,
          updatedAt: now,
        };
        await upsertCollection(userId, c);
        setTitle(''); setDescription(''); setTags(''); setBooks([]); setIsPublic(false);
        onSaved();
      }}
      className="grain-card grain-overlay p-5 space-y-3"
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
        {editing ? 'Edit collection' : 'New collection'}
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title — e.g. Best psychology books"
          className="sm:col-span-2 h-10 px-3 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none w-full"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags: psychology, mind"
          className="h-10 px-3 bg-paper-soft border border-rule rounded-sm text-sm font-mono focus:border-terracotta-400 outline-none w-full"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="A short description"
        rows={2}
        className="w-full bg-paper-soft border border-rule rounded-sm p-3 text-sm focus:border-terracotta-400 outline-none resize-y"
      />
      <BookPicker
        all={allBooks}
        selected={books}
        onChange={setBooks}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-terracotta-400"
          />
          Make this collection public
        </label>
        <div className="flex items-center gap-2">
          {editing && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? 'Update' : 'Create collection'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function BookPicker({
  all,
  selected,
  onChange,
}: {
  all: Array<{ slug: string; title: string }>;
  selected: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [q, setQ] = useState('');
  const filtered = q
    ? all.filter((b) => b.title.toLowerCase().includes(q.toLowerCase())).slice(0, 50)
    : all.slice(0, 50);
  return (
    <div className="border border-rule rounded-sm bg-paper-soft">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter books…"
        className="w-full h-9 px-3 bg-transparent border-b border-rule text-sm focus:border-terracotta-400 outline-none"
      />
      <ul className="max-h-56 overflow-y-auto p-1">
        {filtered.map((b) => {
          const isOn = selected.includes(b.slug);
          return (
            <li key={b.slug}>
              <button
                type="button"
                onClick={() =>
                  onChange(isOn ? selected.filter((s) => s !== b.slug) : [...selected, b.slug])
                }
                className={
                  'w-full text-left text-sm px-2 py-1.5 rounded-sm transition-colors ' +
                  (isOn
                    ? 'bg-terracotta-50/40 text-terracotta-500'
                    : 'hover:bg-paper-deep')
                }
              >
                <span className="font-mono text-[0.625rem] mr-2 text-ink-mute">
                  {isOn ? '✓' : '+'}
                </span>
                {b.title}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-4 text-sm text-ink-mute">No books match.</li>
        )}
      </ul>
      {selected.length > 0 && (
        <p className="text-xs text-ink-mute px-3 py-2 border-t border-rule">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}
