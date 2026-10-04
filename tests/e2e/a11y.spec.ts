import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  '',
  '/services',
  '/services/websites',
  '/services/qa',
  '/work',
  '/work/dar-ot-zemyata',
  '/work/concept-dental-clinic',
  '/process',
  '/pricing',
  '/about',
  '/contact',
  '/quality',
  '/legal/privacy',
  '/legal/terms',
  '/not-a-real-page',
];

for (const locale of ['bg', 'en']) {
  for (const path of pages) {
    test(`axe: ${locale}${path || '/'} has no accessibility violations`, async ({ page }) => {
      await page.goto(`/${locale}${path}`);
      // Let CSS entrance animations finish so contrast is measured on settled colors.
      await page.waitForTimeout(900);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();

      const summary = results.violations.map((v) => ({
        rule: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
      expect(summary).toEqual([]);
    });
  }
}

test('axe: both themes keep the home page accessible', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.goto('/en');
    await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
    await page.waitForTimeout(900);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => `${theme}:${v.id}`)).toEqual([]);
  }
});

test('keyboard: skip link and mobile menu are operable', async ({ page, isMobile }) => {
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  }
});
