import { expect, test } from '@playwright/test';

test('work filters narrow the project list', async ({ page }) => {
  await page.goto('/en/work');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const cards = page
    .getByRole('main')
    .getByRole('listitem')
    .filter({ has: page.getByRole('link') });
  await expect(cards).toHaveCount(2);

  await expect(page.getByRole('button', { name: 'Concepts' })).toHaveCount(0);

  await page.getByRole('button', { name: 'E-commerce' }).click();
  await expect(cards).toHaveCount(1);
});

test('real project hides unfilled [TODO] content in production', async ({ page }) => {
  await page.goto('/bg/work/dar-ot-zemyata');
  await expect(page.getByRole('link', { name: /живия сайт/ })).toHaveAttribute(
    'href',
    'https://darotzemqta.bg',
  );
  await expect(page.getByText('[TODO]')).toHaveCount(0);
});
