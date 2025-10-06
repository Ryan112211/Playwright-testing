const { test, expect } = require('@playwright/test');

test.describe('Example Website Tests', () => {
  test('should load example.com homepage', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check page title
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Check heading is visible
    const heading = page.getByRole('heading', { name: 'Example Domain' });
    await expect(heading).toBeVisible();
  });

  test('should have a link to more information', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check for the "More information..." link
    const link = page.getByRole('link', { name: /More information/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://www.iana.org/domains/example');
  });

  test('should display body text', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check main content is visible
    const content = page.locator('body');
    await expect(content).toContainText('This domain is for use in illustrative examples');
  });
    test('should display body text', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check main content is visible
    const content = page.locator('body');
    await expect(content).toContainText('Termintor');
  });
});