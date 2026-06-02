import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/stores/auth';
import { loadSettings, saveSettings } from '../../lib/firestore';
import type { UserSettings } from '@knowledgeatlas/schemas';
import { Button } from '../ui/Button';
import { useToasts } from '../ui/Toast';

export function SettingsPanel() {
  const user = useAuthStore((s) => s.user);
  const [s, setS] = useState<UserSettings>({
    theme: 'system',
    narrationRate: 1,
    defaultReadingTimeMinutes: 20,
  });
  const [busy, setBusy] = useState(false);
  const { push } = useToasts();

  useEffect(() => {
    if (!user) return;
    loadSettings(user.uid).then((loaded) => {
      if (loaded) setS(loaded);
    });
  }, [user]);

  if (!user) {
    return (
      <p className="text-ink-soft">
        <a href="/signin" className="text-terracotta-500">Sign in</a> to change settings.
      </p>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await saveSettings(user.uid, s);
          push({ tone: 'success', title: 'Settings saved' });
        } catch (er) {
          push({ tone: 'error', title: (er as Error).message });
        } finally { setBusy(false); }
      }}
      className="grain-card grain-overlay p-6 space-y-5"
    >
      <label className="block">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">Theme</span>
        <select
          value={s.theme}
          onChange={(e) => setS({ ...s, theme: e.target.value as UserSettings['theme'] })}
          className="mt-1 w-full h-10 px-2 bg-paper-soft border border-rule rounded-sm text-sm"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="block">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
          Default narration speed ({s.narrationRate.toFixed(2)}×)
        </span>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={s.narrationRate}
          onChange={(e) => setS({ ...s, narrationRate: Number(e.target.value) })}
          className="mt-2 w-full accent-terracotta-400"
        />
      </label>
      <Button type="submit" loading={busy}>Save</Button>
    </form>
  );
}
