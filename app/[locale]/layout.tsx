import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@/components/analytics';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/config';
import { fontVariables } from '@/lib/fonts';
import '../globals.css';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

/** Applies the saved theme before first paint to avoid a flash. */
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title', { name: siteConfig.name }),
    description: t('description'),
    applicationName: siteConfig.name,
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: locale === 'bg' ? 'bg_BG' : 'en_US',
      alternateLocale: locale === 'bg' ? ['en_US'] : ['bg_BG'],
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="bg-accent text-accent-foreground sr-only z-[60] rounded-md px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {t('skip')}
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
