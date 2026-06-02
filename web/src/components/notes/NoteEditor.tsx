import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { watchNotes, createNote, updateNote, deleteNote, toggleNotePin, toggleNoteFavorite } from '../../lib/firestore';
import { useToasts } from '../ui/Toast';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import type { Note } from '@knowledgeatlas/schemas';

export function NoteEditor({ bookSlug, bookTitle }: { bookSlug: string; bookTitle: string }) {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pinned, setPinned] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const { push } = useToasts();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <div className="text-center py-12 border border-dashed border-rule rounded-sm">
        <p className="text-ink-soft">
          <a href="/signin" className="text-terracotta-500">Sign in</a> to take
          notes on <em>{bookTitle}</em>.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!content.trim()) return;
          const tagList = tags
            .split(/[,\s]+/)
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
          if (editing) {
            await updateNote(user.uid, { ...editing, content, tags: tagList, pinned });
            push({ tone: 'success', title: 'Note updated' });
          } else {
            await createNote(user.uid, {
              bookSlug,
              content,
              tags: tagList,
              pinned,
              favorite: false,
            } as Omit<Note, 'id' | 'createdAt' | 'updatedAt'>);
            push({ tone: 'success', title: 'Note saved' });
          }
          setContent('');
          setTags('');
          setPinned(false);
          setEditing(null);
          setRefreshKey((k) => k + 1);
        }}
        className="grain-card grain-overlay p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
            {editing ? 'Edit note' : 'New note'}
          </p>
          <label className="inline-flex items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-terracotta-400"
            />
            Pin
          </label>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What landed for you?"
          rows={4}
          className="w-full bg-paper-soft border border-rule rounded-sm p-3 text-sm leading-relaxed focus:border-terracotta-400 outline-none resize-y"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tags: stoic, habit, framework"
            className="flex-1 min-w-[200px] h-9 px-3 bg-paper-soft border border-rule rounded-sm text-sm font-mono focus:border-terracotta-400 outline-none"
          />
          <Button type="submit" size="sm" disabled={!content.trim()}>
            {editing ? 'Save' : 'Add note'}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(null);
                setContent('');
                setTags('');
                setPinned(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <NotesList
        key={refreshKey}
        ownerId={user.uid}
        bookSlug={bookSlug}
        onEdit={(n) => {
          setEditing(n);
          setContent(n.content);
          setTags(n.tags.join(' '));
          setPinned(n.pinned);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleted={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

function NotesList({
  ownerId,
  bookSlug,
  onEdit,
  onDeleted,
}: {
  ownerId: string;
  bookSlug: string;
  onEdit: (n: Note) => void;
  onDeleted: () => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'favorites'>('all');
  const { push } = useToasts();

  useEffect(() => {
    return watchNotes(
      ownerId,
      (ns) => setNotes(ns.filter((n) => n.bookSlug === bookSlug)),
      () => undefined,
      bookSlug,
    );
  }, [ownerId, bookSlug]);

  const visible = notes
    .filter((n) =>
      filter === 'pinned' ? n.pinned : filter === 'favorites' ? n.favorite : true,
    )
    .filter((n) =>
      q
        ? n.content.toLowerCase().includes(q.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        : true,
    );

  if (visible.length === 0) {
    return (
      <div className="text-center py-10 text-ink-soft text-sm">
        {notes.length === 0
          ? 'No notes yet. The first one is the hardest.'
          : 'No notes match those filters.'}
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notes…"
          className="h-8 px-3 bg-paper-soft border border-rule rounded-sm text-sm flex-1 min-w-[180px] focus:border-terracotta-400 outline-none"
        />
        {(['all', 'pinned', 'favorites'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'h-8 px-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] border rounded-sm transition-colors',
              filter === f
                ? 'border-terracotta-400 text-terracotta-500'
                : 'border-rule text-ink-soft hover:border-terracotta-400',
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {visible.map((n) => (
          <li key={n.id} className="grain-card grain-overlay p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleNotePin(ownerId, n.id, !n.pinned).then(() => push({ tone: 'info', title: n.pinned ? 'Unpinned' : 'Pinned' }))}
                  aria-label={n.pinned ? 'Unpin note' : 'Pin note'}
                  className={cn(
                    'h-6 w-6 inline-flex items-center justify-center rounded-full border transition-colors',
                    n.pinned
                      ? 'border-terracotta-400 text-terracotta-500 bg-terracotta-50/40'
                      : 'border-rule text-ink-mute hover:text-terracotta-500',
                  )}
                >
                  <IconPin />
                </button>
                <button
                  onClick={() => toggleNoteFavorite(ownerId, n.id, !n.favorite).then(() => push({ tone: 'info', title: n.favorite ? 'Unfavorited' : 'Favorited' }))}
                  aria-label={n.favorite ? 'Unfavorite' : 'Favorite'}
                  className={cn(
                    'h-6 w-6 inline-flex items-center justify-center rounded-full border transition-colors',
                    n.favorite
                      ? 'border-gold-400 text-gold-400 bg-gold-50/30'
                      : 'border-rule text-ink-mute hover:text-gold-400',
                  )}
                >
                  <IconStar filled={n.favorite} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(n)}
                  className="h-6 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Delete note?')) return;
                    await deleteNote(ownerId, n.id);
                    push({ tone: 'info', title: 'Note deleted' });
                    onDeleted();
                  }}
                  className="h-6 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute hover:text-terracotta-500"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{n.content}</p>
            {n.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {n.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center h-5 px-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-mute border border-rule"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const IconPin = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
    <path d="M12 2 8 8h3v6l1 2 1-2V8h3z" />
  </svg>
);
const IconStar = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path d="m12 2 3 7 7 .5-5.5 4.5L18 22l-6-4-6 4 1.5-8L2 9.5 9 9z" />
  </svg>
);
