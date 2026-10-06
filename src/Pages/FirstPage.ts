import {Page , Locator} from '@playwright/test';

export class FirstPage {
    readonly page :Page;
    readonly card :Locator
    readonly heading :Locator
    constructor(page:Page){
        this.page = page
       this.card = page.locator('.card-body');
       this.heading = this.card.getByRole('heading', { level: 5 });
    }
}