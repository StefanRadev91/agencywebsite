import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/config';
import { legalLinks, serviceSlugs } from '@/lib/site-nav';
import { Logo } from './logo';

export async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Nav');
  const tServices = await getTranslations('Services.items');
  const socials = Object.entries(siteConfig.socials).filter(([, url]) => url);

  const linkClass = 'text-muted hover:text-foreground transition-colors duration-(--dur-fast)';
  const headingClass = 'mb-4 font-mono text-xs tracking-wide text-muted uppercase';

  return (
    <footer className="border-border mt-(--section-y) border-t">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted max-w-xs text-sm">{t('tagline')}</p>
        </div>

        <div>
          <h2 className={headingClass}>{t('services')}</h2>
          <ul className="space-y-2 text-sm">
            {serviceSlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/services/${slug}`} className={linkClass}>
                  {tServices(`${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>{t('contact')}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className={linkClass}>
                {siteConfig.phone}
              </a>
            </li>
            <li className="text-muted">
              {siteConfig.location.city}, {siteConfig.location.country}
            </li>
            {socials.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>{t('company')}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className={linkClass}>
                {tNav('about')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                {tNav('contact')}
              </Link>
            </li>
            {legalLinks.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className={linkClass}>
                  {t(`legal.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="container-page text-muted flex flex-col gap-2 py-6 text-sm sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>{t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
