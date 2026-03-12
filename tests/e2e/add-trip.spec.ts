import { test, expect } from '@playwright/test';

test.describe('US2 — Add a New Visit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('can add a new trip and see it appear in the country list', async ({ page }) => {
    // Open the add form
    await page.getByLabel('Add a new visit').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill in the country field (type and select from autocomplete)
    await page.getByLabel('Country').fill('Japan');
    await page.getByRole('option', { name: 'Japan' }).click();

    // Fill in the date
    await page.getByLabel('Date visited').fill('2023-04');

    // Submit the form
    await page.getByRole('button', { name: /save/i }).click();

    // Japan should now appear in the country list
    await expect(page.getByText('Japan')).toBeVisible();
  });

  test('shows validation error when country is missing', async ({ page }) => {
    await page.getByLabel('Add a new visit').click();
    await page.getByLabel('Date visited').fill('2023-04');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/country is required/i)).toBeVisible();
  });

  test('shows validation error when date is missing', async ({ page }) => {
    await page.getByLabel('Add a new visit').click();
    await page.getByLabel('Country').fill('Japan');
    await page.getByRole('option', { name: 'Japan' }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/date is required/i)).toBeVisible();
  });
});
