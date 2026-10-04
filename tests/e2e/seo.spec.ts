import { expect, test } from '@playwright/test';

test('unknown URLs return a styled 404 in the right language', async ({ page }) => {
  const response = await page.goto('/en/definitely-not-here');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await expect(page.getByText("This page doesn't exist.")).toBeVisible();

  const bg = await page.goto('/bg/nqma-takava-stranica');
  expect(bg?.status()).toBe(404);
  await expect(page.getByText('Тази страница не съществува.')).toBeVisible();
});

test('unknown case study returns 404', async ({ page }) => {
  const response = await page.goto('/en/work/not-a-project');
  expect(response?.status()).toBe(404);
});

test('legal pages render in both languages', async ({ page }) => {
  await page.goto('/bg/legal/privacy');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Политика за поверителност' }),
  ).toBeVisible();
  await page.goto('/en/legal/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeVisible();
});

test('home exposes canonical, hreflang, Open Graph and ProfessionalService JSON-LD', async ({
  page,
}) => {
  await page.goto('/en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="bg"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'New Wave Web Intelligence',
  );

  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(jsonLd!)).toMatchObject({
    '@type': 'ProfessionalService',
    name: 'New Wave Web Intelligence',
  });
});

test('case study exposes CreativeWork JSON-LD', async ({ page }) => {
  await page.goto('/en/work/concept-dental-clinic');
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(jsonLd!)).toMatchObject({ '@type': 'CreativeWork', name: 'Dental clinic' });
});

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap:');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/bg/work/dar-ot-zemyata');
});

test('Open Graph image renders as a PNG, including Cyrillic', async ({ request }) => {
  const html = await (await request.get('/bg')).text();
  const match = html.match(/property="og:image" content="([^"]+)"/);
  expect(match).not.toBeNull();
  const image = await request.get(new URL(match![1]!).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
});
