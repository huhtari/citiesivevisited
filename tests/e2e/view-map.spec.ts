import { test, expect } from '@playwright/test';

test.describe('US1 — View Countries Visited', () => {
  test.beforeEach(async ({ page }) => {
    // Seed localStorage with sample trips before navigation
    await page.goto('/');
    await page.evaluate(() => {
      const trips = [
        {
          id: '1',
          countryCode: 'JP',
          countryName: 'Japan',
          cities: ['Tokyo', 'Kyoto'],
          visitDate: '2023-04',
          note: 'Cherry blossoms.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          countryCode: 'FR',
          countryName: 'France',
          cities: ['Paris'],
          visitDate: '2022-08',
          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('cv_trips', JSON.stringify(trips));
    });
    await page.reload();
  });

  test('world map renders and visited countries appear in the list', async ({ page }) => {
    // Map container exists
    await expect(page.getByTestId('world-map')).toBeVisible();

    // Countries appear in the list
    await expect(page.getByText('Japan')).toBeVisible();
    await expect(page.getByText('France')).toBeVisible();
  });

  test('shows city counts in the country list', async ({ page }) => {
    await expect(page.getByText(/2 cit/)).toBeVisible(); // Japan: 2 cities
    await expect(page.getByText(/1 cit/)).toBeVisible(); // France: 1 city
  });

  test('shows empty state when no trips are recorded', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText(/no trips/i)).toBeVisible();
  });
});
