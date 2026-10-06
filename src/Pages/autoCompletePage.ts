//his is a React Select / Auto Complete multi-select, not a normal <select>.

import {Page , Locator , expect} from '@playwright/test'

export class autoCompletePage{
   readonly page : Page;
    // Locators
    multipleColorInput: Locator;
    readonly singleColorInput: Locator;

    constructor(page:Page){
        this.page = page;
        this.multipleColorInput = page.locator('#autoCompleteMultipleInput');
        this.singleColorInput = page.locator('#autoCompleteSingleInput');
    }

    async goto(){
        await this.page.goto("https://demoqa.com/auto-complete")
    }
    async multipleColors(color:string){
        await this.multipleColorInput.fill(color);
         const option = this.page.getByRole('option', {
            name: color,
            exact: true
        });
         await option .click()

    }

    async delete(color:string){
        const removeButton  = this.page.getByRole('button', {name: `Remove ${color}` })
        await removeButton.click()
    }

    async singlecolor(color:string){
        await this.singleColorInput.fill(color);
        const option = this.page.getByRole('option', {
            name : color,
            exact : true

        })
        await option.click()

    }


}