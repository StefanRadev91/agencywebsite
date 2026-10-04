import { describe, expect, it } from 'vitest';
import { getProjects } from '@/lib/content/projects';
import { projectSchema } from '@/lib/schemas/project';

const concept = {
  slug: 'concept-test',
  kind: 'concept',
  categories: ['website'],
  featured: false,
  order: 99,
  hue: 100,
  title: { bg: 'Тест', en: 'Test' },
  summary: { bg: 'Тест', en: 'Test' },
  client: null,
  role: { bg: 'Роля', en: 'Role' },
  challenge: { bg: 'А', en: 'A' },
  solution: { bg: 'Б', en: 'B' },
  stack: ['Next.js'],
  screens: [],
  results: [],
  quality: null,
  liveUrl: null,
};

describe('project content', () => {
  const projects = getProjects();

  it('loads and validates every project file', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('includes the required portfolio entries', () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining(['dar-ot-zemyata', 'hotel-booking', 'price-monitoring']),
    );
    expect(projects.filter((p) => p.kind === 'concept').length).toBeGreaterThanOrEqual(3);
  });

  it('never gives a concept a client, live URL, metrics or results', () => {
    for (const p of projects.filter((p) => p.kind === 'concept')) {
      expect(p.client).toBeNull();
      expect(p.liveUrl).toBeNull();
      expect(p.quality).toBeNull();
      expect(p.results).toEqual([]);
    }
  });
});

describe('projectSchema concept rules', () => {
  it('accepts a clean concept', () => {
    expect(projectSchema.safeParse(concept).success).toBe(true);
  });

  it.each([
    ['a client', { client: { name: 'Acme', industry: { bg: 'х', en: 'x' } } }],
    ['a live URL', { liveUrl: 'https://example.com' }],
    ['quality metrics', { quality: { lighthouse: null, e2eTests: 5 } }],
    ['results', { results: [{ label: { bg: 'х', en: 'x' }, value: '+50%' }] }],
  ])('rejects a concept with %s', (_name, override) => {
    expect(projectSchema.safeParse({ ...concept, ...override }).success).toBe(false);
  });

  it('allows [TODO] placeholders on real projects', () => {
    const real = { ...concept, kind: 'client', challenge: '[TODO]', client: null };
    expect(projectSchema.safeParse(real).success).toBe(true);
  });
});
