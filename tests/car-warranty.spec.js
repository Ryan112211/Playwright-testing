import { test, expect } from '@playwright/test';

// Function to generate unique test data
function generateUniqueTestData() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  
  const firstNames = ['Test', 'Auto', 'Demo', 'QA', 'Verify', 'Check'];
  const lastNames = ['User', 'Person', 'Account', 'Member', 'Tester'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)] + randomNum;
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)] + timestamp;
  const email = `test.${firstName}.${lastName}@automated-test.com`.toLowerCase();
  
  return {
    firstName,
    lastName,
    email,
    fullName: `${firstName} ${lastName}`
  };
}

test('car warranty flow for vehicle with no warnings and terms', async ({ page }) => {
  test.setTimeout(60000); // Set timeout to 60 seconds
  
  const testData = generateUniqueTestData();
  
  console.log('Test running with data:', testData);
  
  await page.goto('https://version2-develop.fdm.dk/vi-tilbyder/forsikring/bilreparation');
  await page.getByRole('button', { name: 'Accepter alle' }).click();
  await page.getByRole('textbox', { name: 'Indtast din nummerplade' }).click();
  await page.getByRole('textbox', { name: 'Indtast din nummerplade' }).fill('CJ73433');
  await page.getByRole('button', { name: 'Søg' }).click();
  await page.getByRole('button', { name: 'Næste' }).click();
  await page.getByRole('button', { name: 'Næste' }).click();
  await page.waitForURL('**/bestil/medlemskab/**');
  await page.getByRole('link', { name: 'Bliv medlem' }).click();
  await page.getByRole('textbox', { name: 'Fornavn' }).fill(testData.firstName);
  await page.getByRole('textbox', { name: 'Efternavn' }).fill(testData.lastName);
  
  await page.getByRole('textbox', { name: 'Adresse' }).click();
  await page.getByRole('textbox', { name: 'Adresse' }).fill('sa');
  await page.getByRole('option', { name: 'Saabydalvej' }).click();
  await page.getByRole('option', { name: 'Saabydalvej 2, 8550 Ryomgård' }).click();
  
  await page.getByRole('textbox', { name: 'Telefon nummer +' }).fill('11111111');
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.email);
  
  await page.getByText('Jeg har læst og accepterer').click();
  await page.getByRole('button', { name: 'Næste' }).click();
  
  // Accept terms on bilreparation page
  await page.waitForURL('**/bestil/bilreparation/**');
  await page.locator('label').filter({ hasText: 'FDM samarbejder med WIA. Hvis' }).click();
  await page.locator('label').filter({ hasText: 'Jeg har givet korrekte' }).click();
  await page.getByRole('button', { name: 'Næste' }).click();
  
  // Navigate to payment
  await page.waitForURL('**/betaling/**', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Næste' }).click();
  
  // Verify we're on payment page
  await expect(page).toHaveURL(/betaling/);
});