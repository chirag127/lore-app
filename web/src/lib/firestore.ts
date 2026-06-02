import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  type FirestoreError,
  type QueryConstraint,
} from 'firebase/firestore';
import {
  type Note,
  type Review,
  type Collection,
  type ReadingProgress,
  type ReadingStatus,
  type UserSettings,
  NoteSchema,
  ReviewSchema,
  CollectionSchema,
  ReadingProgressSchema,
  UserSettingsSchema,
} from '@knowledgeatlas/schemas';
import { getDb } from './firebase';

export const uid = () => crypto.randomUUID();

const tsToMs = (t: unknown): number =>
  t instanceof Timestamp ? t.toMillis() : typeof t === 'number' ? t : Date.now();

const noteFrom = (id: string, data: Record<string, unknown>): Note =>
  NoteSchema.parse({
    id,
    bookSlug: data['bookSlug'] as string,
    content: data['content'] as string,
    tags: (data['tags'] as string[]) ?? [],
    pinned: Boolean(data['pinned']),
    favorite: Boolean(data['favorite']),
    createdAt: tsToMs(data['createdAt']),
    updatedAt: tsToMs(data['updatedAt'] ?? data['createdAt']),
  });

const reviewFrom = (id: string, data: Record<string, unknown>): Review =>
  ReviewSchema.parse({
    id,
    bookSlug: data['bookSlug'] as string,
    rating: data['rating'] as number,
    pros: (data['pros'] as string) ?? '',
    cons: (data['cons'] as string) ?? '',
    recommendation: (data['recommendation'] as string) ?? '',
    createdAt: tsToMs(data['createdAt']),
    updatedAt: tsToMs(data['updatedAt'] ?? data['createdAt']),
  });

const collectionFrom = (id: string, data: Record<string, unknown>): Collection =>
  CollectionSchema.parse({
    id,
    title: data['title'] as string,
    description: (data['description'] as string) ?? '',
    tags: (data['tags'] as string[]) ?? [],
    books: (data['books'] as string[]) ?? [],
    public: Boolean(data['public']),
    ownerId: data['ownerId'] as string,
    createdAt: tsToMs(data['createdAt']),
    updatedAt: tsToMs(data['updatedAt'] ?? data['createdAt']),
  });

const progressFrom = (bookSlug: string, data: Record<string, unknown>): ReadingProgress =>
  ReadingProgressSchema.parse({
    bookSlug,
    status: (data['status'] as ReadingStatus) ?? 'want',
    percent: Number(data['percent'] ?? 0),
    startedAt: data['startedAt'] ? tsToMs(data['startedAt']) : undefined,
    finishedAt: data['finishedAt'] ? tsToMs(data['finishedAt']) : undefined,
    lastPosition: data['lastPosition'] as string | undefined,
    updatedAt: tsToMs(data['updatedAt']),
  });

/* ----------------------- Notes ----------------------- */

export function watchNotes(
  ownerId: string,
  onNext: (notes: Note[]) => void,
  onError: (e: FirestoreError) => void,
  bookSlug?: string,
) {
  const db = getDb();
  const constraints: QueryConstraint[] = [orderBy('updatedAt', 'desc')];
  if (bookSlug) constraints.unshift(where('bookSlug', '==', bookSlug));
  const q = query(collection(db, `users/${ownerId}/notes`), ...constraints);
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => noteFrom(d.id, d.data()))),
    onError,
  );
}

export async function createNote(
  ownerId: string,
  input: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Note> {
  const db = getDb();
  const now = Date.now();
  const id = uid();
  const note: Note = NoteSchema.parse({ id, ...input, createdAt: now, updatedAt: now });
  await setDoc(doc(db, `users/${ownerId}/notes`, id), {
    bookSlug: note.bookSlug,
    content: note.content,
    tags: note.tags,
    pinned: note.pinned,
    favorite: note.favorite,
    createdAt: now,
    updatedAt: now,
  });
  return note;
}

export async function updateNote(
  ownerId: string,
  note: Note,
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, `users/${ownerId}/notes`, note.id), {
    content: note.content,
    tags: note.tags,
    pinned: note.pinned,
    favorite: note.favorite,
    updatedAt: Date.now(),
  });
}

export async function toggleNotePin(
  ownerId: string,
  noteId: string,
  pinned: boolean,
): Promise<void> {
  await updateDoc(doc(getDb(), `users/${ownerId}/notes`, noteId), {
    pinned,
    updatedAt: Date.now(),
  });
}

export async function toggleNoteFavorite(
  ownerId: string,
  noteId: string,
  favorite: boolean,
): Promise<void> {
  await updateDoc(doc(getDb(), `users/${ownerId}/notes`, noteId), {
    favorite,
    updatedAt: Date.now(),
  });
}

export async function deleteNote(ownerId: string, noteId: string): Promise<void> {
  await deleteDoc(doc(getDb(), `users/${ownerId}/notes`, noteId));
}

/* ----------------------- Reviews ----------------------- */

export function watchReviews(
  ownerId: string,
  onNext: (reviews: Review[]) => void,
  onError: (e: FirestoreError) => void,
  bookSlug?: string,
) {
  const db = getDb();
  const constraints: QueryConstraint[] = [orderBy('updatedAt', 'desc')];
  if (bookSlug) constraints.unshift(where('bookSlug', '==', bookSlug));
  const q = query(collection(db, `users/${ownerId}/reviews`), ...constraints);
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => reviewFrom(d.id, d.data()))),
    onError,
  );
}

export function watchPublicReviews(
  bookSlug: string,
  onNext: (reviews: Array<Review & { authorName?: string }>) => void,
  onError: (e: FirestoreError) => void,
  max = 50,
) {
  const db = getDb();
  const q = query(
    collection(db, 'publicReviews'),
    where('bookSlug', '==', bookSlug),
    orderBy('updatedAt', 'desc'),
    limit(max),
  );
  return onSnapshot(
    q,
    (snap) =>
      onNext(
        snap.docs.map((d) => ({
          ...reviewFrom(d.id, d.data()),
          authorName: (d.data()['authorName'] as string) ?? 'Anonymous',
        })),
      ),
    onError,
  );
}

export async function upsertReview(
  ownerId: string,
  authorName: string,
  review: Review,
  publish: boolean,
): Promise<void> {
  const db = getDb();
  const now = Date.now();
  const payload = {
    bookSlug: review.bookSlug,
    rating: review.rating,
    pros: review.pros,
    cons: review.cons,
    recommendation: review.recommendation,
    updatedAt: now,
    createdAt: review.createdAt || now,
  };
  await setDoc(doc(db, `users/${ownerId}/reviews`, review.id), payload);
  if (publish) {
    await setDoc(doc(db, 'publicReviews', review.id), {
      ...payload,
      ownerId,
      authorName,
    });
  } else {
    await deleteDoc(doc(db, 'publicReviews', review.id)).catch(() => undefined);
  }
}

export async function deleteReview(ownerId: string, reviewId: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, `users/${ownerId}/reviews`, reviewId));
  await deleteDoc(doc(db, 'publicReviews', reviewId)).catch(() => undefined);
}

/* ----------------------- Bookmarks ----------------------- */

export async function toggleBookmark(
  ownerId: string,
  bookSlug: string,
  on: boolean,
): Promise<void> {
  const db = getDb();
  const ref = doc(db, `users/${ownerId}/bookmarks`, bookSlug);
  if (on) {
    await setDoc(ref, { bookSlug, createdAt: Date.now() });
  } else {
    await deleteDoc(ref);
  }
}

export function watchBookmarks(
  ownerId: string,
  onNext: (slugs: string[]) => void,
  onError: (e: FirestoreError) => void,
) {
  const db = getDb();
  const q = query(
    collection(db, `users/${ownerId}/bookmarks`),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.id)),
    onError,
  );
}

/* ----------------------- Reading progress ----------------------- */

export function watchProgress(
  ownerId: string,
  onNext: (p: ReadingProgress[]) => void,
  onError: (e: FirestoreError) => void,
) {
  const db = getDb();
  const q = query(collection(db, `users/${ownerId}/readingProgress`));
  return onSnapshot(
    q,
    (snap) =>
      onNext(snap.docs.map((d) => progressFrom(d.id, d.data()))),
    onError,
  );
}

export function watchProgressForBook(
  ownerId: string,
  bookSlug: string,
  onNext: (p: ReadingProgress | null) => void,
  onError: (e: FirestoreError) => void,
) {
  const db = getDb();
  return onSnapshot(
    doc(db, `users/${ownerId}/readingProgress`, bookSlug),
    (snap) => {
      if (!snap.exists()) return onNext(null);
      onNext(progressFrom(bookSlug, snap.data()));
    },
    onError,
  );
}

export async function setProgress(
  ownerId: string,
  bookSlug: string,
  patch: Partial<ReadingProgress>,
): Promise<void> {
  const db = getDb();
  const now = Date.now();
  const data: Record<string, unknown> = { ...patch, updatedAt: now };
  if (patch.status === 'reading' && !patch.startedAt) {
    data['startedAt'] = now;
  }
  if (patch.status === 'finished') {
    data['finishedAt'] = now;
    data['percent'] = 100;
  }
  await setDoc(doc(db, `users/${ownerId}/readingProgress`, bookSlug), data, {
    merge: true,
  });
}

/* ----------------------- Collections ----------------------- */

export function watchCollections(
  ownerId: string,
  onNext: (c: Collection[]) => void,
  onError: (e: FirestoreError) => void,
) {
  const db = getDb();
  const q = query(
    collection(db, `users/${ownerId}/collections`),
    orderBy('updatedAt', 'desc'),
  );
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => collectionFrom(d.id, d.data()))),
    onError,
  );
}

export async function upsertCollection(
  ownerId: string,
  c: Collection,
): Promise<void> {
  const db = getDb();
  const now = Date.now();
  await setDoc(doc(db, `users/${ownerId}/collections`, c.id), {
    title: c.title,
    description: c.description,
    tags: c.tags,
    books: c.books,
    public: c.public,
    ownerId,
    createdAt: c.createdAt || now,
    updatedAt: now,
  });
  if (c.public) {
    await setDoc(doc(db, 'publicCollections', c.id), {
      title: c.title,
      description: c.description,
      tags: c.tags,
      books: c.books,
      ownerId,
      createdAt: c.createdAt || now,
      updatedAt: now,
    });
  } else {
    await deleteDoc(doc(db, 'publicCollections', c.id)).catch(() => undefined);
  }
}

export async function deleteCollection(ownerId: string, id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, `users/${ownerId}/collections`, id));
  await deleteDoc(doc(db, 'publicCollections', id)).catch(() => undefined);
}

/* ----------------------- Settings ----------------------- */

export async function loadSettings(
  ownerId: string,
): Promise<UserSettings | null> {
  const { getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(getDb(), `users/${ownerId}/settings`, 'me'));
  if (!snap.exists()) return null;
  try {
    return UserSettingsSchema.parse(snap.data());
  } catch {
    return null;
  }
}

export async function saveSettings(
  ownerId: string,
  s: UserSettings,
): Promise<void> {
  const parsed = UserSettingsSchema.parse(s);
  await setDoc(doc(getDb(), `users/${ownerId}/settings`, 'me'), parsed, {
    merge: true,
  });
}

/* ----------------------- Public feed (used on book pages) ----------------------- */

export interface PublicBookStat {
  slug: string;
  readers: number;
  finished: number;
  avgRating: number;
}

export function watchBookStats(
  bookSlug: string,
  onNext: (s: PublicBookStat | null) => void,
  onError: (e: FirestoreError) => void,
) {
  const db = getDb();
  return onSnapshot(
    doc(db, 'bookStats', bookSlug),
    (snap) => {
      if (!snap.exists()) return onNext(null);
      const d = snap.data();
      onNext({
        slug: bookSlug,
        readers: Number(d['readers'] ?? 0),
        finished: Number(d['finished'] ?? 0),
        avgRating: Number(d['avgRating'] ?? 0),
      });
    },
    onError,
  );
}

export { addDoc, serverTimestamp };
