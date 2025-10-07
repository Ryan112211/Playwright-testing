import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://version2-develop.fdm.dk/vi-tilbyder/forsikring/bilreparation');
  await page.getByRole('button', { name: 'Accepter alle' }).click();
  await page.getByRole('textbox', { name: 'Indtast din nummerplade' }).click();
  await page.getByRole('textbox', { name: 'Indtast din nummerplade' }).fill('DY69454');
  await page.getByRole('button', { name: 'Søg' }).click();
  await page.getByRole('button', { name: 'close-popover' }).click();
  await page.locator('label').filter({ hasText: 'Jeg bekræfter på tro & love:' }).click();
  await page.getByRole('textbox', { name: 'Hvor mange km har bilen kørt' }).click();
  await page.getByRole('textbox', { name: 'Hvor mange km har bilen kørt' }).fill('5000');
  await page.getByRole('button', { name: 'Næste' }).click();
  await page.getByRole('button', { name: 'close-popover' }).click();
  await page.getByRole('button', { name: 'Næste' }).click();
  await page.goto('https://version2-develop.fdm.dk/bestil/medlemskab/');
});