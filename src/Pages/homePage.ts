import {Page , Locator} from  '@playwright/test';

export class HomePage{
    readonly page : Page;
    readonly headerNavigations : Locator;
    readonly headerLinks : Locator;
    constructor(page:Page){
        this.page = page;
        this.headerNavigations =  page.getByRole('navigation');
        this.headerLinks = this.headerNavigations.getByRole('link');
        

    }
    
    
  async printHeaderLinks(): Promise<string[]> {

    const links = await this.headerLinks.allTextContents();

    for (const link of links) {

        const linkText = link.trim();

        if (linkText === 'Practice Apps') {

            console.log(`Clicking: ${linkText}`);

            await this.headerNavigations
                .getByRole('link', { name: linkText, exact: true })
                .click();

        } else {

            console.log(linkText);
        }
    }

    return links;
}
}
