import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@/components/analytics';
import { SiteWidgets } from '@/components/widgets/site-widgets';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';
import { routing } from '@/i18n/routing';
import { isLegalPublished, siteConfig } from '@/lib/config';
import { resolveAnalytics } from '@/lib/analytics';
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
  const tNav = await getTranslations({ locale, namespace: 'Nav' });
  const tChat = await getTranslations({ locale, namespace: 'Chat' });
  const tConsent = await getTranslations({ locale, namespace: 'Consent' });
  const analyticsAvailable = resolveAnalytics(process.env) !== null;
  const chatName = { name: siteConfig.shortName };
  const widgetProps = {
    locale: locale as 'bg' | 'en',
    consent: {
      analyticsAvailable,
      policyHref: isLegalPublished('cookies') ? `/${locale}/legal/cookies` : null,
      labels: {
        title: tConsent('title'),
        text: tConsent(analyticsAvailable ? 'text' : 'textBasic'),
        policy: tConsent('policy'),
        accept: tConsent('accept'),
        reject: tConsent('reject'),
        customize: tConsent('customize'),
        save: tConsent('save'),
        ok: tConsent('ok'),
        necessaryTitle: tConsent('necessaryTitle'),
        necessaryText: tConsent('necessaryText'),
        analyticsTitle: tConsent('analyticsTitle'),
        analyticsText: tConsent('analyticsText'),
        always: tConsent('always'),
      },
    },
    chat: {
      contact: siteConfig.email
        ? tChat('contactBoth', { phone: siteConfig.phone, email: siteConfig.email })
        : siteConfig.phone,
      labels: {
        open: tChat('open'),
        close: tChat('close'),
        title: tChat('title', chatName),
        status: tChat('status'),
        disclaimer: tChat('disclaimer'),
        welcome: tChat('welcome', chatName),
        fallback: tChat('fallback', { contact: '{contact}' }),
        inputLabel: tChat('inputLabel'),
        placeholder: tChat('placeholder'),
        send: tChat('send'),
        chips: tChat('chips'),
        typing: tChat('typing'),
        cta: tChat('cta'),
        teaser: tChat('teaser'),
        teaserOpen: tChat('teaserOpen'),
        teaserDismiss: tChat('teaserDismiss'),
      },
    },
  };
  const headerLabels = {
    nav: {
      main: tNav('main'),
      services: tNav('services'),
      work: tNav('work'),
      process: tNav('process'),
      pricing: tNav('pricing'),
      about: tNav('about'),
      cta: tNav('cta'),
      openMenu: tNav('openMenu'),
      closeMenu: tNav('closeMenu'),
    },
    language: {
      label: t('language'),
      names: { bg: t('languageName.bg'), en: t('languageName.en') },
    },
    theme: { toLight: t('switchToLight'), toDark: t('switchToDark') },
  };

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* Client components get their strings as props; pages add the namespaces they need. */}
        <NextIntlClientProvider messages={{}}>
          <Providers>
            <a
              href="#main"
              className="bg-accent text-accent-foreground sr-only z-[60] rounded-md px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {t('skip')}
            </a>
            <div aria-hidden className="scroll-progress" />
            <Header labels={headerLabels} />
            <main id="main">{children}</main>
            <Footer />
            <SiteWidgets {...widgetProps} />
          </Providers>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
