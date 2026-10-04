import { Link } from '@/i18n/navigation';

export function ServiceCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group border-border bg-surface shadow-card ease-out-expo hover:border-accent-ink relative flex h-full flex-col rounded-lg border p-6 transition-[transform,border-color] duration-(--dur-base) hover:-translate-y-1 md:p-8"
    >
      {icon && (
        <span
          aria-hidden
          className="bg-surface-2 text-accent-ink group-hover:bg-accent group-hover:text-accent-foreground mb-8 inline-flex size-12 items-center justify-center rounded-md transition-colors duration-(--dur-base)"
        >
          {icon}
        </span>
      )}
      <h3 className="font-display text-h3 font-extrabold">{title}</h3>
      <p className="text-muted mt-3 flex-1">{description}</p>
      <span
        aria-hidden
        className="text-accent-ink ease-out-expo mt-6 inline-block transition-transform duration-(--dur-base) group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
