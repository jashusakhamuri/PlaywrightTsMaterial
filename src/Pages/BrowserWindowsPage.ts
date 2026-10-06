import { Page, Locator } from '@playwright/test';

export class BrowserWindowsPage {

    readonly page: Page;

    readonly newTabButton: Locator;
    readonly newWindowButton: Locator;
    readonly messageWindowButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.newTabButton = page.locator('#tabButton');
        this.newWindowButton = page.locator('#windowButton');
        this.messageWindowButton = page.locator('#messageWindowButton');
    }

    async openNewTab(): Promise<Page> {
        const popupPromise = this.page.waitForEvent('popup');

        await this.newTabButton.click();

        return await popupPromise;
    }

    async openNewWindow(): Promise<Page> {
        const popupPromise = this.page.waitForEvent('popup');

        await this.newWindowButton.click();

        return await popupPromise;
    }

    async openMessageWindow(): Promise<Page> {
        const popupPromise = this.page.waitForEvent('popup');

        await this.messageWindowButton.click();

        return await popupPromise;
    }
}