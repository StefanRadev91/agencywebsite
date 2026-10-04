import { Reveal } from '@/components/ui/reveal';

/** Illustrative test-run mock. Lines reveal one by one; contains no measured numbers. */
export function QaTerminal({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="border-border bg-surface shadow-pop overflow-hidden rounded-lg border font-mono text-sm">
      <div className="border-border flex items-center gap-2 border-b px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden className="bg-border size-2.5 rounded-full" />
        ))}
        <span className="text-muted ms-3 text-xs">{title}</span>
      </div>
      <ul className="space-y-3 p-5 md:p-6">
        {lines.map((line, i) => (
          <li key={line}>
            <Reveal delay={0.15 * i} y={10} className="flex gap-3">
              <span aria-hidden className="text-accent-ink">
                ✓
              </span>
              <span>{line}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
