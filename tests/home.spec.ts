import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Verifier link', async ({ page }) => {
  await page.getByRole('link', { name: 'Verifier', exact: true }).click();
  await expect(page).toHaveURL(/\/verifier/);
});

test('Get started link', async ({ page }) => {
  await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await expect(page).toHaveURL(/\/verifier/);
});

test('Sample Results thumbnail', async ({ page }) => {
  await page.getByAltText('sample results thumbnail').click();
  await expect(page.getByAltText('sample results', { exact: true })).toBeVisible();
});
