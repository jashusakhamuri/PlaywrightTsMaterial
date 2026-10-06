import {test , expect} from '@playwright/test';
import {HomePage} from '../../src/Pages/homePage';

test('Home Page Test', async({page})=>{
    const homePageObj = new HomePage(page);
    await page.goto('/');
   await  homePageObj.printHeaderLinks();
  

})