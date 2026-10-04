import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/config';

export function Logo() {
  return (
    <Link
      href="/"
      prefetch={false}
      className="flex items-center gap-3"
      aria-label={siteConfig.name}
    >
      <span
        aria-hidden
        className="bg-accent text-accent-foreground font-display flex size-9 items-center justify-center rounded-md text-sm font-extrabold"
      >
        NW
      </span>
      <span className="font-display leading-none font-extrabold">
        {siteConfig.shortName}
        <span className="text-muted mt-1 hidden text-[0.65rem] font-semibold tracking-wide uppercase sm:block">
          Web Intelligence
        </span>
      </span>
    </Link>
  );
}
