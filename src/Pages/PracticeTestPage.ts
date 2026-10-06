import { Page, Locator } from '@playwright/test';

export class PracticeTestPage {
    readonly page: Page;
    readonly tablist: Locator;
    readonly tabHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.tablist = page.getByRole('tablist').getByRole('tab');

        this.tabHeader = page.locator('div[class*="flex-col"] h3');
    }

    async printTablist(): Promise<void> {

        const tablistItems = await this.tablist.allTextContents();
        console.log(`Tablist Items: ${tablistItems.join(', ')}`);

        for (const tab of tablistItems) {

            const tabLocator = this.tablist.getByText(tab, { exact: true });

            await tabLocator.click();

            const tabHeaderCards = await this.tabHeader.allTextContents();

            console.log(`Tab: ${tab}`);
            console.log(`Tab Header Cards: ${tabHeaderCards.join(', ')}`);
        }
    }
}