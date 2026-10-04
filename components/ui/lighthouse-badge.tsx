import { cn } from '@/lib/utils/cn';

export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

/** Four measured Lighthouse scores. Only render with real numbers. */
export function LighthouseBadge({
  scores,
  labels,
  className,
}: {
  scores: LighthouseScores;
  labels: Record<keyof LighthouseScores, string>;
  className?: string;
}) {
  const keys = ['performance', 'accessibility', 'bestPractices', 'seo'] as const;
  return (
    <dl className={cn('grid grid-cols-2 gap-4 sm:grid-cols-4', className)}>
      {keys.map((key) => (
        <div
          key={key}
          className="border-border bg-surface rounded-lg border p-4 text-center font-mono"
        >
          <dd className="text-accent-ink text-3xl font-medium">{scores[key]}</dd>
          <dt className="text-muted mt-1 text-xs">{labels[key]}</dt>
        </div>
      ))}
    </dl>
  );
}
