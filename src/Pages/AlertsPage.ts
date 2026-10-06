import { type Locator, type Page } from '@playwright/test';

export class AlertsPage {
    readonly page: Page;
    readonly alertButton: Locator;
    readonly promptButton: Locator;
    readonly confirmButton: Locator;
    readonly timerAlertButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.alertButton = page.locator('#alertButton');
        // Note: #promtButton is demoqa's real id (their typo) - do NOT "fix" it
        this.promptButton = page.locator('#promtButton');
        this.confirmButton = page.locator('#confirmButton');
        this.timerAlertButton = page.locator('#timerAlertButton');
    }

    async goto(): Promise<void> {
        await this.page.goto('https://demoqa.com/alerts');
    }

    // Simple Alert
    async handleAlert(): Promise<string> {
        let message = '';

        const handled = new Promise<void>((resolve) => {
            this.page.once('dialog', async (dialog) => {
                message = dialog.message();
                await dialog.accept();
                resolve();
            });
        });

        await this.alertButton.click();
        await handled;
        return message;
    }

    // Prompt
    async handlePrompt(promptValue: string): Promise<string> {
        let message = '';

        const handled = new Promise<void>((resolve) => {
            this.page.once('dialog', async (dialog) => {
                message = dialog.message();
                await dialog.accept(promptValue);
                resolve();
            });
        });

        await this.promptButton.click();
        await handled;
        return message;
    }

    // Confirm (dismiss = Cancel)
    async handleConfirm(): Promise<string> {
        let message = '';

        const handled = new Promise<void>((resolve) => {
            this.page.once('dialog', async (dialog) => {
                message = dialog.message();
                await dialog.dismiss();
                resolve();
            });
        });

        await this.confirmButton.click();
        await handled;
        return message;
    }

    // Timer Alert (appears 5 seconds after click)
    async handleTimerAlert(): Promise<string> {
        let message = '';

        const handled = new Promise<void>((resolve) => {
            this.page.once('dialog', async (dialog) => {
                message = dialog.message();
                await dialog.accept();
                resolve();
            });
        });

        await this.timerAlertButton.click();
        await handled; // resolves ~5s later when the dialog fires
        return message;
    }
}
