

import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

setup('Login and save storage state', async ({ page }) => {

  await page.goto('https://ambtestlab.netlify.app/');

  await page.getByRole('link', { name: 'Login' }).click();

  await page.locator('#email').fill('ambtestlab@ambmindspace.com');

  await page.getByRole('textbox', {
    name: 'Enter your password',
  }).fill('test1234');

  await page.getByRole('button', {
    name: 'Login',
  }).click();

  // Wait until login actually creates the session
  await expect.poll(async () => {
    return await page.evaluate(() =>
      window.sessionStorage.getItem('adminLoggedIn')
    );
  }).toBe('true');

  const savedSession = await page.evaluate(() => ({
    adminEmail: window.sessionStorage.getItem('adminEmail'),
    authToken: window.sessionStorage.getItem('authToken'),
    adminLoggedIn: window.sessionStorage.getItem('adminLoggedIn'),
  }));

  console.log('Session saved:', savedSession);

  fs.writeFileSync(
    'playwright/.auth/session.json',
    JSON.stringify(savedSession, null, 2)
  );
});