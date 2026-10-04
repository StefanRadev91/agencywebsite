import fs from 'node:fs';
import path from 'node:path';
import { projectSchema, type Project } from '@/lib/schemas/project';

export type Locale = 'bg' | 'en';
export type Localized = { bg: string; en: string };

export const pick = (value: Localized, locale: string) => value[locale as Locale] ?? value.en;

const dir = path.join(process.cwd(), 'content', 'projects');
let cache: Project[] | null = null;

/** Reads and validates every content/projects/*.json. Throws at build time on bad content. */
export function getProjects(): Project[] {
  if (cache) return cache;

  const projects = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const parsed = projectSchema.safeParse(
        JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')),
      );
      if (!parsed.success) {
        throw new Error(`Invalid project content in ${file}:\n${parsed.error.message}`);
      }
      if (`${parsed.data.slug}.json` !== file) {
        throw new Error(`Slug "${parsed.data.slug}" must match file name ${file}`);
      }
      return parsed.data;
    })
    .sort((a, b) => a.order - b.order);

  cache = projects;
  return projects;
}

export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);

/** The project after `slug` in display order (wraps around). */
export function getNextProject(slug: string) {
  const all = getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  return all[(index + 1) % all.length]!;
}
