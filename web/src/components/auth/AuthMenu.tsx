import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import {
  signInWithGoogle,
  startEmailLink,
  signOut,
} from '../../lib/auth';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export function AuthMenu() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [open, setOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading && !user) {
    return <div className="h-9 w-24 bg-paper-deep rounded-sm animate-breath" />;
  }
  if (!user) {
    return (
      <div className="relative" ref={ref}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpen((o) => !o)}
        >
          Sign in
        </Button>
        {open && (
          <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] grain-card grain-overlay p-2 z-40 animate-reveal">
            <button
              onClick={async () => {
                setBusy(true); setErr(null);
                try { await signInWithGoogle(); } catch (e) { setErr((e as Error).message); }
                finally { setBusy(false); }
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-paper-deep rounded-sm transition-colors"
            >
              <IconGoogle /> Continue with Google
            </button>
            <div className="my-2 h-px bg-rule" />
            {!showEmail ? (
              <button
                onClick={() => setShowEmail(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-paper-deep rounded-sm transition-colors"
              >
                <IconMail /> Continue with email
              </button>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true); setErr(null);
                  try {
                    await startEmailLink(email);
                    setEmailSent(true);
                  } catch (er) { setErr((er as Error).message); }
                  finally { setBusy(false); }
                }}
                className="p-2 space-y-2"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none"
                />
                <Button type="submit" size="sm" loading={busy} className="w-full">
                  Send sign-in link
                </Button>
                {emailSent && (
                  <p className="text-xs text-emerald-600">Check your inbox.</p>
                )}
              </form>
            )}
            {err && <p className="px-3 pb-2 text-xs text-terracotta-500">{err}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 sm:h-9 w-9 sm:w-auto sm:pl-1 sm:pr-3 justify-center sm:justify-start rounded-full border border-rule hover:border-terracotta-400 transition-colors focus-ring"
        aria-label="Account menu"
      >
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-400 text-parchment-50 font-mono text-xs"
        >
          {(user.displayName || user.email || '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="text-sm hidden sm:inline max-w-[10ch] truncate">
          {user.displayName || user.email?.split('@')[0]}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 grain-card grain-overlay p-2 z-40 animate-reveal">
          <a
            href="/dashboard"
            className={cn(linkCls)}
          >Dashboard</a>
          <a href="/library" className={linkCls}>Library</a>
          <a href="/notes" className={linkCls}>Notes</a>
          <a href="/reviews" className={linkCls}>Reviews</a>
          <a href="/settings" className={linkCls}>Settings</a>
          <div className="my-1 h-px bg-rule" />
          <button
            onClick={() => signOut()}
            className={cn(linkCls, 'w-full text-left')}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const linkCls =
  'block px-3 py-2 text-sm rounded-sm hover:bg-paper-deep transition-colors';

const IconGoogle = () => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
