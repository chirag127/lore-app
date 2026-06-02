import { useEffect, useState } from 'react';
import { SearchBox } from '../search/SearchBox';
import { AuthMenu } from '../auth/AuthMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
  currentPath: string;
  bookCount: number;
}

export function MobileNav({ links, currentPath, bookCount }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    currentPath === href || (href !== '/' && currentPath.startsWith(href));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-sm border border-rule text-ink-soft hover:text-terracotta-500 hover:border-terracotta-400 transition-colors focus-ring"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        <IconMenu />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden animate-reveal"
          role="dialog"
          aria-modal="true"
          id="mobile-nav"
        >
          <div
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="absolute right-0 top-0 bottom-0 w-[min(20rem,85vw)] bg-paper border-l border-rule flex flex-col shadow-[var(--shadow-lift)] overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-4 border-b border-rule sticky top-0 bg-paper z-10">
              <span className="font-display text-lg font-light tracking-tight">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-rule text-ink-soft hover:text-terracotta-500 hover:border-terracotta-400 transition-colors focus-ring"
                aria-label="Close menu"
              >
                <IconClose />
              </button>
            </div>

            <div className="px-4 py-4 border-b border-rule">
              <SearchBox />
            </div>

            <ul className="flex-1 py-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={cn(
                      'flex items-center px-4 h-12 font-mono text-sm uppercase tracking-[0.18em] transition-colors',
                      isActive(l.href)
                        ? 'text-terracotta-500 bg-terracotta-50/30 border-l-2 border-terracotta-400'
                        : 'text-ink-soft hover:text-terracotta-500 hover:bg-paper-deep border-l-2 border-transparent',
                    )}
                    aria-current={isActive(l.href) ? 'page' : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="px-4 py-4 border-t border-rule flex items-center justify-between gap-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
                {bookCount.toLocaleString()} books
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <AuthMenu />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
