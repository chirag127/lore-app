import { useEffect, useState } from 'react';
import { completeEmailLink } from '../../lib/auth';
import { useAuthStore } from '../../lib/stores/auth';

export default function FinishLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await completeEmailLink();
        if (!active) return;
        if (u) {
          setUser(u);
          setStatus('success');
          window.location.replace('/dashboard');
        } else {
          setStatus('error');
          setErr('This link is invalid or has expired.');
        }
      } catch (e) {
        if (!active) return;
        setStatus('error');
        setErr((e as Error).message);
      }
    })();
    return () => { active = false; };
  }, [setUser]);

  return (
    <div className="text-center">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-ink-mute">
        {status === 'pending' ? 'Finishing sign in' : status}
      </p>
      <h1 className="mt-2 font-display text-3xl font-light">
        {status === 'pending'
          ? 'Verifying your link…'
          : status === 'success'
          ? 'Welcome back.'
          : 'Something went wrong.'}
      </h1>
      {err && <p className="mt-4 text-terracotta-500 text-sm">{err}</p>}
    </div>
  );
}
