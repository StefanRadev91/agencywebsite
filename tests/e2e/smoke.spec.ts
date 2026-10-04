import { expect, test } from '@playwright/test';

for (const locale of ['bg', 'en']) {
  test(`home renders in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}
