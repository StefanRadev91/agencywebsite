import { cn } from '@/lib/utils/cn';

export function Card({
  interactive = false,
  className,
  children,
}: {
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'border-border bg-surface shadow-card rounded-lg border p-6 md:p-8',
        interactive &&
          'ease-out-expo hover:border-accent-ink transition-[transform,border-color] duration-(--dur-base) hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </div>
  );
}
