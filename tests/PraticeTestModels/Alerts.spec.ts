import { test, expect } from '@playwright/test';
import { AlertsPage } from '../../src/Pages/AlertsPage';

test.describe('Alerts / Popups', () => {

    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);

        await alertsPage.goto();
    });

    test('should handle OK alert', async () => {

        const message = await alertsPage.handleAlert();

        expect(message).toBe('You clicked a button');
    });


    test('should handle prompt popup', async () => {

        const message = await alertsPage.handlePrompt('Jashu');

        expect(message).toBe('Please enter your name');
    });


    test('should handle confirm popup', async () => {

        const message = await alertsPage.handleConfirm();

        expect(message).toBe('Do you confirm action?');
    });


    test('should handle timer alert', async () => {

        const message = await alertsPage.handleTimerAlert();

        expect(message).toBe('This alert appeared after 5 seconds');
    });

});