import type { ProjectCardProps } from '@/components/ui/project-card';
import type { Project } from '@/lib/schemas/project';
import { isTodo } from './todo';
import { pick } from './projects';

type T = (key: string) => string;

export type WorkItem = {
  slug: string;
  categories: string[];
  isConcept: boolean;
  card: ProjectCardProps;
};

/** Lowest of the four Lighthouse scores — only when real numbers exist. */
export function lighthouseFloor(project: Project) {
  const q = project.quality;
  if (isTodo(q) || !q?.lighthouse) return undefined;
  return Math.min(...Object.values(q.lighthouse));
}

/** Builds serializable card props. `t` must be scoped to the "Work" namespace. */
export function toWorkItem(project: Project, locale: string, t: T): WorkItem {
  const isConcept = project.kind === 'concept';
  const floor = lighthouseFloor(project);
  const statusKey =
    project.status === 'in-progress'
      ? 'inProgress'
      : project.kind === 'internal'
        ? 'ownProduct'
        : undefined;

  const card: ProjectCardProps = {
    href: `/work/${project.slug}`,
    title: pick(project.title, locale),
    summary: pick(project.summary, locale),
    category: project.categories.map((c) => t(`categories.${c}`)).join(' / '),
    hue: project.hue,
    conceptLabel: isConcept ? t('conceptLabel') : undefined,
    statusLabel: statusKey ? t(`status.${statusKey}`) : undefined,
    badge: floor === undefined ? undefined : `Lighthouse ≥ ${floor}`,
  };

  return { slug: project.slug, categories: project.categories, isConcept, card };
}
