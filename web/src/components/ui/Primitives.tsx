import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grain-card grain-overlay p-5 sm:p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 sm:mb-12 flex flex-wrap items-end justify-between gap-6 reading-rule">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-ink-mute mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-display-md font-light text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-ink-soft text-pretty">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Ornament({ children }: { children?: ReactNode }) {
  return (
    <div className="ornament font-display italic">
      <span className="ornament-mark" />
      <span className="text-[0.75rem] tracking-[0.18em] uppercase">
        {children}
      </span>
      <span className="ornament-mark" />
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-light tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}

export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-rule rounded-sm">
      <Ornament>{title}</Ornament>
      {description && (
        <p className="mt-4 text-ink-soft max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Tag({ children, href }: { children: ReactNode; href?: string }) {
  const cls =
    'inline-flex items-center gap-1 px-2 h-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] border border-rule text-ink-soft hover:border-terracotta-400 hover:text-terracotta-500 transition-colors';
  if (href)
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  return <span className={cls}>{children}</span>;
}
