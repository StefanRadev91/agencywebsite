import { cn } from '@/lib/utils/cn';

/** Styled gradient "browser mockup" used until real screenshots exist. No external images. */
export function PlaceholderVisual({
  hue = 90,
  label,
  className,
}: {
  hue?: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn('relative aspect-[16/10] w-full overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 18%), hsl(${(hue + 60) % 360} 70% 8%))`,
      }}
    >
      <div
        aria-hidden
        className="absolute -top-1/4 -right-1/6 size-3/5 rounded-full opacity-60 blur-3xl"
        style={{ background: `hsl(${hue} 90% 55%)` }}
      />
      <div
        aria-hidden
        className="absolute inset-x-[8%] top-[14%] bottom-0 rounded-t-lg border border-white/15 bg-black/40 backdrop-blur-sm"
      >
        <div className="flex gap-1.5 border-b border-white/10 px-3 py-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-white/25" />
          ))}
        </div>
        <div className="space-y-2.5 p-4">
          <div className="h-3 w-2/5 rounded bg-white/70" />
          <div className="h-2 w-3/4 rounded bg-white/25" />
          <div className="h-2 w-3/5 rounded bg-white/25" />
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
