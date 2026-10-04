'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';
import { navItems } from '@/lib/site-nav';
import { cn } from '@/lib/utils/cn';
import { LanguageSwitcher, type LanguageLabels } from './language-switcher';
import { Logo } from './logo';
import { ThemeToggle, type ThemeLabels } from './theme-toggle';

export type HeaderLabels = {
  nav: Record<'main' | 'cta' | 'openMenu' | 'closeMenu' | (typeof navItems)[number]['key'], string>;
  language: LanguageLabels;
  theme: ThemeLabels;
};

/** Labels come from the server so this client component needs no i18n runtime (keeps JS small). */
export function Header({ labels }: { labels: HeaderLabels }) {
  const t = (key: keyof HeaderLabels['nav']) => labels.nav[key];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color] duration-(--dur-base)',
        'border-b',
        scrolled || open ? 'border-border' : 'border-transparent bg-transparent',
      )}
    >
      {/* Blur lives on its own layer: backdrop-filter on <header> would trap the fixed mobile menu. */}
      <div
        aria-hidden
        className={cn(
          'bg-background/85 absolute inset-0 -z-10 backdrop-blur-md transition-opacity duration-(--dur-base)',
          scrolled || open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="container-page flex h-(--header-h) items-center justify-between gap-6">
        <Logo />

        <nav aria-label={t('main')} className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              prefetch={false}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-(--dur-fast)',
                isActive(href) ? 'text-accent-ink' : 'text-muted hover:text-foreground',
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher labels={labels.language} />
            <ThemeToggle labels={labels.theme} />
            <Button href="/contact" prefetch={false}>
              {t('cta')}
            </Button>
          </div>
          <button
            type="button"
            className="border-border hover:border-foreground inline-flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={cn(
                  'bg-foreground ease-out-expo absolute inset-x-0 top-0 h-0.5 transition-transform duration-(--dur-base)',
                  open && 'translate-y-[5px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'bg-foreground ease-out-expo absolute inset-x-0 bottom-0 h-0.5 transition-transform duration-(--dur-base)',
                  open && '-translate-y-[5px] -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          data-lenis-prevent
          className="animate-fade-in bg-background fixed inset-x-0 top-(--header-h) bottom-0 overflow-y-auto lg:hidden"
        >
          <nav aria-label={t('main')} className="container-page flex flex-col py-8">
            {navItems.map(({ key, href }, i) => (
              <div
                key={key}
                className="animate-rise-fade"
                style={{ '--delay': `${0.05 * i}s` } as React.CSSProperties}
              >
                <Link
                  href={href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'border-border font-display text-h2 block border-b py-4 font-extrabold',
                    isActive(href) && 'text-accent-ink',
                  )}
                >
                  {t(key)}
                </Link>
              </div>
            ))}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg" prefetch={false} onClick={() => setOpen(false)}>
                {t('cta')}
              </Button>
              <LanguageSwitcher labels={labels.language} />
              <ThemeToggle labels={labels.theme} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
