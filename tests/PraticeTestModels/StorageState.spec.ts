import { test , Page , Locator , expect} from '@playwright/test'
import fs from 'fs';
test('Open application without login', async ({ page }) => {

  const savedSession = JSON.parse(
    fs.readFileSync('playwright/.auth/session.json', 'utf-8')
  );

  await page.goto('https://ambtestlab.netlify.app/');

  await page.evaluate((session) => {
    window.sessionStorage.setItem('adminEmail', session.adminEmail);
    window.sessionStorage.setItem('authToken', session.authToken);
    window.sessionStorage.setItem('adminLoggedIn', session.adminLoggedIn);
  }, savedSession);

  await page.goto(
    'https://ambtestlab.netlify.app/admin-panel.html'
  );

  await page.getByRole('link', { name: /Dashboard/ }).click();

  // remaining actions...
   await page.getByRole('link', { name: /Dashboard/ }).click();
  await page.getByRole('link', { name: /Mutual Funds/ }).click();
  await page.getByRole('link', { name: '3' }).click();
  await page.getByRole('link', { name: 'Prev' }).click();
  await page.getByRole('link', { name: 'Prev' }).click();
  await page.getByRole('link', { name: /Purchases/ }).click();
  await page.getByRole('link', { name: /Users/ }).click();
  await page.getByRole('link', { name: /SIP Calculator/ }).click();
  await page.getByRole('link', { name: /Settings/ }).click();
  await page.getByRole('link', { name: /Input Showcase/ }).click();
  await page.getByRole('link', { name: /Show All Inputs/ }).click();
});



 
