import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Note, Review, ReadingProgress, Collection } from '@knowledgeatlas/schemas';

interface LibraryState {
  recent: string[];
  pushRecent: (slug: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      recent: [],
      pushRecent: (slug) =>
        set((s) => ({
          recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 24),
        })),
    }),
    { name: 'knowledgeatlas:library', storage: createJSONStorage(() => localStorage) },
  ),
);

export type { Note, Review, ReadingProgress, Collection };
