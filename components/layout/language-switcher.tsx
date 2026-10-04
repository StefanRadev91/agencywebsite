'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';

export type LanguageLabels = { label: string; names: Record<string, string> };

export function LanguageSwitcher({
  labels,
  className,
}: {
  labels: LanguageLabels;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={labels.label}
      className={cn('flex items-center gap-1 font-mono text-sm', className)}
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          aria-label={labels.names[l]}
          className={cn(
            'rounded-full px-3 py-1.5 uppercase transition-colors duration-(--dur-fast)',
            l === locale ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-foreground',
          )}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
