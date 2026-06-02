import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __pagefind?: {
      search: (q: string) => Promise<{
        results: Array<{ id: string; data: () => Promise<any> }>;
      }>;
      init?: () => Promise<void>;
    };
  }
}

interface Hit {
  url: string;
  title: string;
  excerpt: string;
}

export function SearchBox({ placeholder = 'Search books, ideas, frameworks…' }: { placeholder?: string }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let active = true;
    const id = window.setTimeout(async () => {
      if (!q.trim()) {
        setHits([]);
        return;
      }
      setLoading(true);
      try {
        if (!window.__pagefind) {
          const pagefindUrl = new URL('/pagefind/pagefind.js', window.location.origin).toString();
          const mod = (await import(/* @vite-ignore */ pagefindUrl)) as unknown as NonNullable<Window['__pagefind']>;
          window.__pagefind = mod;
          await mod.init?.();
        }
        const pf = window.__pagefind;
        if (!pf) {
          if (active) setHits([]);
          return;
        }
        const res = await pf.search(q);
        const top = res.results.slice(0, 8);
        const data = await Promise.all(top.map((r) => r.data()));
        if (!active) return;
        setHits(
          data.map((d: any) => ({
            url: d.url,
            title: d.meta?.title ?? d.raw_title ?? 'Untitled',
            excerpt: d.excerpt ?? '',
          })),
        );
      } catch {
        if (active) setHits([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 150);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [q]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-4 sm:pr-16 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none"
          aria-label="Search KnowledgeAtlas"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[0.625rem] text-ink-mute border border-rule px-1.5 h-5 items-center rounded-sm">
          ⌘K
        </kbd>
      </div>
      {open && q && (
        <div className="absolute z-30 left-0 right-0 mt-1 grain-card grain-overlay p-1 max-h-80 sm:max-h-96 overflow-y-auto animate-reveal">
          {loading && <p className="px-3 py-2 text-sm text-ink-soft">Searching…</p>}
          {!loading && hits.length === 0 && (
            <p className="px-3 py-2 text-sm text-ink-soft">No matches.</p>
          )}
          {hits.map((h) => (
            <a
              key={h.url}
              href={h.url}
              className="block px-3 py-2 rounded-sm hover:bg-paper-deep"
            >
              <p
                className="text-sm font-medium"
                dangerouslySetInnerHTML={{ __html: h.title }}
              />
              <p
                className="text-xs text-ink-soft line-clamp-2"
                dangerouslySetInnerHTML={{ __html: h.excerpt }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
