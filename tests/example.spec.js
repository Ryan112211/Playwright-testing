const { test, expect } = require('@playwright/test');

test.describe('Playwright Website Tests', () => {
  test('homepage has title and get started link', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Playwright/);
    
    const getStarted = page.getByRole('link', { name: 'Get started' });
    await expect(getStarted).toBeVisible();
  });

  test('check documentation navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/.*docs.*/);
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByPlaceholder('Search docs').fill('testing');
    
    const searchResults = page.locator('.DocSearch-Hits');
    await expect(searchResults).toBeVisible({ timeout: 10000 });
  });
});