import { cn } from '@/lib/utils/cn';

type Variant = 'neutral' | 'accent' | 'outline' | 'mono';

const variants: Record<Variant, string> = {
  neutral: 'bg-surface-2 text-foreground',
  accent: 'bg-accent text-accent-foreground',
  outline: 'border border-border text-muted',
  mono: 'border border-border bg-surface font-mono text-accent-ink',
};

export function Tag({
  variant = 'neutral',
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs leading-none font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
