import { expect, test } from '@playwright/test';

test('work filters narrow the project list', async ({ page }) => {
  await page.goto('/en/work');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const cards = page
    .getByRole('main')
    .getByRole('listitem')
    .filter({ has: page.getByRole('link') });
  await expect(cards).toHaveCount(6);

  await page.getByRole('button', { name: 'Concepts' }).click();
  await expect(cards).toHaveCount(3);
  await expect(page.getByText('Concept', { exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: 'E-commerce' }).click();
  await expect(cards).toHaveCount(1);
});

test('concept case study is clearly labeled and has no fake results', async ({ page }) => {
  await page.goto('/en/work/concept-dental-clinic');
  await expect(page.getByRole('heading', { level: 1, name: 'Dental clinic' })).toBeVisible();
  await expect(page.getByText('no real client', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Results' })).toHaveCount(0);
});

test('real project hides unfilled [TODO] content in production', async ({ page }) => {
  await page.goto('/bg/work/dar-ot-zemyata');
  await expect(page.getByRole('link', { name: /живия сайт/ })).toHaveAttribute(
    'href',
    'https://darotzemqta.bg',
  );
  await expect(page.getByText('[TODO]')).toHaveCount(0);
});
