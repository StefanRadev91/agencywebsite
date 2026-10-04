import { cn } from '@/lib/utils/cn';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Words (0-based indexes) rendered in the accent color. */
  accentWords?: number[];
};

/**
 * Word-by-word rise. Pure CSS (transform only, text always visible), so it runs before
 * hydration and never delays the largest contentful paint. The full text stays available
 * to assistive tech.
 */
export function AnimatedHeadline({ text, as: Tag = 'h1', className, accentWords = [] }: Props) {
  const words = text.split(' ');
  return (
    <Tag className={cn('font-display font-extrabold text-balance', className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className={cn('animate-rise inline-block', accentWords.includes(i) && 'text-accent-ink')}
          style={{ '--delay': `${0.06 * i}s` } as React.CSSProperties}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
