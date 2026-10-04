import { cn } from '@/lib/utils/cn';

type Props = {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  /** Render the title as the page's <h1> (use once per page). */
  h1?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** Page section with the shared container, vertical rhythm and optional heading block. */
export function Section({ id, eyebrow, title, intro, h1, className, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  const Heading = h1 ? 'h1' : 'h2';
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
              <Heading
                id={headingId}
                className={cn(
                  'font-display font-extrabold text-balance',
                  h1 ? 'text-h1' : 'text-h2',
                )}
              >
                {title}
              </Heading>
            )}
            {intro && <p className="text-muted mt-5 text-lg text-pretty">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
