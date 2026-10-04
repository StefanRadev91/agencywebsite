import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { ArrowUpRight } from './icons';
import type { ProjectImage } from '@/lib/schemas/project';
import { ProjectMedia } from './project-media';
import { Tag } from './tag';

export type ProjectCardProps = {
  href: string;
  title: string;
  category: string;
  summary: string;
  /** Marks concept work so it can never be mistaken for a real client. */
  conceptLabel?: string;
  statusLabel?: string;
  /** e.g. "Lighthouse 100" — only pass real, measured values. */
  badge?: string;
  hue?: number;
  /** Real cover screenshot; placeholder is used when absent. */
  image?: ProjectImage;
  /** Heading level for the title; use 2 when the card sits directly under the page <h1>. */
  headingLevel?: 2 | 3;
  className?: string;
};

export function ProjectCard({
  href,
  title,
  category,
  summary,
  conceptLabel,
  statusLabel,
  badge,
  hue,
  image,
  headingLevel = 3,
  className,
}: ProjectCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Link
      href={href}
      className={cn(
        'group border-border bg-surface shadow-card hover:border-accent-ink block overflow-hidden rounded-lg border transition-[border-color] duration-(--dur-base)',
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <ProjectMedia
          image={image}
          hue={hue}
          label={title}
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={60}
          className="ease-out-expo transition-transform duration-(--dur-slow) group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {conceptLabel && <Tag variant="accent">{conceptLabel}</Tag>}
          {statusLabel && <Tag variant="neutral">{statusLabel}</Tag>}
        </div>
        {badge && (
          <Tag variant="mono" className="absolute right-3 bottom-3">
            {badge}
          </Tag>
        )}
      </div>
      <div className="p-6">
        <p className="text-muted mb-2 font-mono text-xs tracking-wide uppercase">{category}</p>
        <div className="flex items-start justify-between gap-4">
          <Heading className="font-display text-h3 font-extrabold">{title}</Heading>
          <span
            aria-hidden
            className="text-accent-ink ease-out-expo mt-1 inline-block text-xl transition-transform duration-(--dur-base) group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100"
          >
            <ArrowUpRight />
          </span>
        </div>
        <p className="text-muted mt-2">{summary}</p>
      </div>
    </Link>
  );
}
