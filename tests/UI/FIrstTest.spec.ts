import{test , expect} from '@playwright/test';
import { FirstPage } from '../../src/Pages/FirstPage';


test('First Test', async({page})=>{
    const FirstPageObj = new FirstPage(page);
    await page.goto("https://demoqa.com/")
   const cardTexts: string[] = await FirstPageObj.card.allInnerTexts();
   console.log(cardTexts);
   



})