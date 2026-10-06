import { test } from '@playwright/test';
import { HomePage } from '../../src/Pages/homePage';
import { PracticeTestPage } from '../../src/Pages/PracticeTestPage';

test('Practice Test', async ({ page }) => {

    const homePageObj = new HomePage(page);
    const practiceTestPageObj = new PracticeTestPage(page);

    await page.goto('/');

    await homePageObj.printHeaderLinks();

    await practiceTestPageObj.printTablist();

});