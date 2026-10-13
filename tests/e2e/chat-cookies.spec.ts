import { expect, test } from '@playwright/test';

test.describe('cookie banner', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('asks on the first visit and remembers the choice', async ({ page, context }) => {
    await page.goto('/en');
    const banner = page.getByRole('dialog', { name: 'Cookies' });
    await expect(banner).toBeVisible();

    await page.getByRole('button', { name: 'Got it' }).click();
    await expect(banner).toBeHidden();
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === 'nw_consent')?.value).toBe('v1.a0');

    await page.reload();
    await page.waitForTimeout(2500);
    await expect(banner).toBeHidden();
  });

  test('can be reopened from the footer', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Cookie settings' }).click();
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });
});

test.describe('chat assistant', () => {
  test('answers a frequent question and points to a human contact', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open chat' }).click();
    const panel = page.getByRole('dialog', { name: /assistant/i });
    await expect(panel).toBeVisible();
    await expect(panel.getByText('automatic assistant of New Wave')).toBeVisible();

    await panel.getByLabel('Your message').fill('How much does a website cost?');
    await panel.getByLabel('Your message').press('Enter');
    await expect(panel.getByText(/depends on the scope and complexity/)).toBeVisible({
      timeout: 8000,
    });
    await expect(panel.getByRole('link', { name: 'Free consultation' })).toHaveAttribute(
      'href',
      /\/en\/contact$/,
    );
  });

  test('says so when it does not understand and shows how to reach a person', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open chat' }).click();
    const panel = page.getByRole('dialog', { name: /assistant/i });
    await panel.getByLabel('Your message').fill('qwerty zxcvb');
    await panel.getByLabel('Your message').press('Enter');
    await expect(panel.getByText(/not sure I understood/)).toBeVisible({ timeout: 8000 });
    await expect(panel.getByText(/\+359/)).toBeVisible();
  });

  test('suggested questions work and Escape closes the chat', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open chat' }).click();
    const panel = page.getByRole('dialog', { name: /assistant/i });
    await panel.getByRole('button', { name: 'What services do you offer?' }).click();
    await expect(panel.getByText(/five things/)).toBeVisible({ timeout: 8000 });
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('invites the visitor once, after a few seconds', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Have a question? Ask our automatic assistant.')).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole('button', { name: 'Dismiss notification' }).click();
    await page.reload();
    await page.waitForTimeout(11_000);
    await expect(page.getByText('Have a question? Ask our automatic assistant.')).toBeHidden();
  });
});
