import { describe, expect, it } from 'vitest';
import { getPricing, getServices, getTeam } from '@/lib/content/site-content';
import { serviceSlugs } from '@/lib/site-nav';

describe('services content', () => {
  it('has exactly one entry for every service slug', () => {
    expect(
      getServices()
        .map((s) => s.slug)
        .sort(),
    ).toEqual([...serviceSlugs].sort());
  });

  it('has bilingual FAQ entries for each service', () => {
    for (const service of getServices()) {
      expect(service.faq.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('pricing content', () => {
  const pricing = getPricing();

  it('has three website tiers and at least two maintenance plans', () => {
    expect(pricing.websites).toHaveLength(3);
    expect(pricing.maintenance.length).toBeGreaterThanOrEqual(2);
  });

  it('highlights at most one website tier', () => {
    expect(pricing.websites.filter((p) => p.highlighted).length).toBeLessThanOrEqual(1);
  });
});

describe('team content', () => {
  it('lists both founders', () => {
    expect(getTeam().members.map((m) => m.name)).toEqual(['Martin Lichev', 'Stefan Radev']);
  });
});
