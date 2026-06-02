import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-terracotta-400 text-parchment-50 hover:bg-terracotta-500 active:bg-terracotta-600 shadow-[var(--shadow-soft)]',
  ghost:
    'bg-transparent text-ink hover:bg-paper-deep border border-transparent',
  outline:
    'bg-transparent text-ink border border-rule-strong hover:border-terracotta-400 hover:text-terracotta-500',
  danger:
    'bg-transparent text-terracotta-500 border border-terracotta-300 hover:bg-terracotta-50',
  link:
    'bg-transparent text-terracotta-500 underline-offset-4 hover:underline px-0 py-0 h-auto',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', icon, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[2px] font-medium tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-ring',
        variant === 'link' ? '' : sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
});

function Spinner() {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}
