import { type ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export function Tabs({
  tabs,
  initial,
  ariaLabel,
}: {
  tabs: Tab[];
  initial?: string;
  ariaLabel: string;
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);
  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex gap-1 border-b border-rule overflow-x-auto no-scrollbar"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(
              'relative px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] whitespace-nowrap transition-colors',
              t.id === active
                ? 'text-terracotta-500'
                : 'text-ink-mute hover:text-ink',
            )}
          >
            {t.icon}
            {t.label}
            {t.id === active && (
              <span className="absolute -bottom-px left-2 right-2 h-px bg-terracotta-400" />
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-8">
        {current?.content}
      </div>
    </div>
  );
}
