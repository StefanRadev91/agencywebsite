import { expect, test } from '@playwright/test';

const pages = [
  '/services',
  '/services/websites',
  '/services/qa',
  '/process',
  '/pricing',
  '/about',
  '/quality',
  '/work',
];

for (const locale of ['bg', 'en']) {
  for (const path of pages) {
    test(`${locale}${path} renders a single h1`, async ({ page }) => {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });
  }
}

test('pricing shows the free-start conditions and never exposes [TODO]', async ({ page }) => {
  await page.goto('/en/pricing');
  await expect(page.getByRole('heading', { name: 'How the free start works' })).toBeVisible();
  await expect(page.getByText('Rights on payment')).toBeVisible();
  await expect(page.getByText('[TODO]')).toHaveCount(0);
});

test('process marks the free steps', async ({ page }) => {
  await page.goto('/en/process');
  await expect(page.getByText('Free', { exact: true })).toHaveCount(2);
});
