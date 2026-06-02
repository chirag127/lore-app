import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

type ToastTone = 'info' | 'success' | 'error';
interface Toast { id: string; tone: ToastTone; title: string; body?: string }

const EVENT = 'knowledgeatlas:toast';

export function pushToast(t: Omit<Toast, 'id'>): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(EVENT, { detail: { ...t, id: crypto.randomUUID() } }),
  );
}

export function useToasts(): { push: typeof pushToast } {
  return { push: pushToast };
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const t = (e as CustomEvent<Toast>).detail;
      setItems((s) => [...s, t]);
      window.setTimeout(() => {
        setItems((s) => s.filter((x) => x.id !== t.id));
      }, 4500);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);
  return (
    <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-4 sm:right-4 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-sm">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'grain-card grain-overlay px-4 py-3 text-sm animate-reveal',
            t.tone === 'success' && 'border-l-2 border-l-emerald-500',
            t.tone === 'error' && 'border-l-2 border-l-terracotta-500',
            t.tone === 'info' && 'border-l-2 border-l-gold-400',
          )}
        >
          <p className="font-medium">{t.title}</p>
          {t.body && <p className="mt-1 text-ink-soft text-xs">{t.body}</p>}
        </div>
      ))}
    </div>
  );
}
