import { cn } from '@/lib/utils/cn';

type Props = {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Page section with the shared container, vertical rhythm and optional heading block. */
export function Section({ id, eyebrow, title, intro, className, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn('py-(--section-y)', className)}
    >
      <div className="container-page">
        {(eyebrow || title || intro) && (
          <header className="mb-12 max-w-3xl md:mb-16">
            {eyebrow && (
              <p className="text-accent-ink mb-4 font-mono text-sm tracking-wide uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 id={headingId} className="font-display text-h2 font-extrabold text-balance">
                {title}
              </h2>
            )}
            {intro && <p className="text-muted mt-5 text-lg text-pretty">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
