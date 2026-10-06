import {test , expect} from '@playwright/test';
import {CommonPage} from '../../src/Pages/CommonPage';

test('verify the card click ' , async({page})=>{
    const commonPage = new CommonPage(page);
    await page.goto("/");
    await commonPage.clickPracticeApp();
    await commonPage.getCardByHeading("AutomationPractice Portal");
})