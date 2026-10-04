import { expect, test, type Page } from '@playwright/test';

/** The email send is mocked: the route is intercepted, nothing reaches Resend. */
async function fillValidForm(page: Page) {
  await page.getByLabel('Name').fill('Ivan Petrov');
  await page.getByLabel('Email').fill('ivan@example.com');
  await page.getByLabel('Project type').selectOption('website');
  await page.getByLabel('Budget').selectOption('unsure');
  await page.getByLabel('Timeline').selectOption('flexible');
  await page.getByLabel('Message').fill('We need a new website for our small business.');
  await page.getByLabel(/I agree to my data/).check();
}

test('shows validation errors and does not send an empty form', async ({ page }) => {
  let sent = false;
  await page.route('**/api/contact', async (route) => {
    sent = true;
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto('/en/contact');
  await page.getByRole('button', { name: 'Send enquiry' }).click();

  await expect(page.getByText('Enter your name (at least 2 characters).')).toBeVisible();
  await expect(page.getByText('Consent is required to send the enquiry.')).toBeVisible();
  expect(sent).toBe(false);
});

test('submits a valid enquiry and shows the success state', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto('/en/contact');
  await fillValidForm(page);
  await page.getByRole('button', { name: 'Send enquiry' }).click();

  await expect(page.getByText('Thank you! Your enquiry has been sent.')).toBeVisible();
  expect(body).toMatchObject({ email: 'ivan@example.com', consent: true, hp: '', locale: 'en' });
});

test('shows an error state when sending fails', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 502, json: { ok: false, error: 'send-failed' } }),
  );

  await page.goto('/en/contact');
  await fillValidForm(page);
  await page.getByRole('button', { name: 'Send enquiry' }).click();

  await expect(page.getByRole('alert').filter({ hasText: 'Something went wrong' })).toBeVisible();
});

test('contact page is available in Bulgarian with the phone number', async ({ page }) => {
  await page.goto('/bg/contact');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Разкажете ни за проекта си');
  await expect(
    page.getByRole('main').getByRole('link', { name: '+359 897 269 135' }),
  ).toHaveAttribute('href', 'tel:+359897269135');
});
