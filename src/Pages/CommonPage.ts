import {Page, Locator} from "@playwright/test";
export class CommonPage {
    readonly page : Page;
    readonly PraticeAppsLink : Locator;
   
    constructor(page:Page){
        this.page= page;
        this.PraticeAppsLink =   page.getByRole('link', { name: 'Practice Apps' });
       
    }
    getCardByHeading(cardHeading:string):Locator{
        return  this.page.locator('.text-card').filter({has:this.page.getByRole('heading', {name:cardHeading,exact:true})});

    }

    async clickPracticeApp(){
        await this.PraticeAppsLink.click();
    }
    async clickPracticeAppsLink(cardTitle:string){
        const cardItem = this.getCardByHeading(cardTitle);
        await  cardItem.getByRole("button", {name: 'Start Practicing',
            exact: true
        }).click();
    }
    }
