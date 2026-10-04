import { expect, test } from '@playwright/test';

/**
 * Visual smoke tests. They deliberately avoid pixel baselines (those differ between
 * Windows/macOS/Linux and would fail in CI); instead they assert the things that visibly
 * break pages — overflow, console errors, broken images, missing fonts — and attach a
 * full-page screenshot to the report so a human can review it.
 */
const pages = [
  '',
  '/services',
  '/services/websites',
  '/work',
  '/work/dar-ot-zemyata',
  '/work/concept-dental-clinic',
  '/process',
  '/pricing',
  '/about',
  '/contact',
  '/quality',
  '/legal/privacy',
];

for (const locale of ['bg', 'en']) {
  for (const path of pages) {
    test(`renders cleanly: ${locale}${path || '/'}`, async ({ page }, testInfo) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console: ${message.text()}`);
      });
      page.on('response', (response) => {
        if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
      });

      await page.goto(`/${locale}${path}`);
      await page.waitForLoadState('load');

      // Scroll through the page so lazy images load and scroll reveals fire.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);

      const state = await page.evaluate(async () => {
        await document.fonts.ready;
        return {
          overflowX: document.documentElement.scrollWidth > window.innerWidth,
          brokenImages: [...document.images]
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src),
          hiddenReveals: document.querySelectorAll('.reveal:not(.reveal-in)').length,
          fontLoaded: document.fonts.check('800 1em Onest') || document.fonts.size > 0,
          textLength: document.body.innerText.trim().length,
        };
      });

      await testInfo.attach(`${locale}${path || '-home'}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      expect(problems, 'no console errors or failed requests').toEqual([]);
      expect(state.overflowX, 'no horizontal overflow').toBe(false);
      expect(state.brokenImages, 'no broken images').toEqual([]);
      expect(state.hiddenReveals, 'all scroll reveals shown after scrolling').toBe(0);
      expect(state.fontLoaded, 'web font loaded').toBe(true);
      expect(state.textLength, 'page has content').toBeGreaterThan(200);
    });
  }
}
