import { useEffect, useState } from 'react';

const useMatch = (q: string) => {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(q);
    const onChange = () => setM(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [q]);
  return m;
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const sysDark = useMatch('(prefers-color-scheme: dark)');
  const effective = theme === 'system' ? (sysDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', effective === 'dark');
  }, [effective]);

  const cycle = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    try { localStorage.setItem('knowledgeatlas:theme', next); } catch { /* ignore */ }
  };

  const label =
    theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light';
  return (
    <button
      onClick={cycle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-soft hover:text-terracotta-500 hover:border-terracotta-400 transition-colors focus-ring"
      title={`Theme: ${label}`}
      aria-label={`Theme: ${label} (click to change)`}
    >
      {effective === 'dark' ? <IconMoon /> : <IconSun />}
    </button>
  );
}

const IconSun = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinejoin="round" />
  </svg>
);
