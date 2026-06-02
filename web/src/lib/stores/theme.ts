import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  set: (t: Theme) => void;
  resolved: () => 'light' | 'dark';
}

const STORAGE_KEY = 'knowledgeatlas:theme';

function detect(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored ?? 'system';
}

function apply(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const dark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

function resolved(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: detect(),
  set: (t) => {
    set({ theme: t });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, t);
    }
    apply(t);
  },
  resolved: () => resolved(get().theme),
}));

export function bootstrapTheme() {
  if (typeof window === 'undefined') return;
  apply(detect());
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (get().theme === 'system') apply('system');
    });
}

const get = useThemeStore.getState;
