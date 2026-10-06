import { test, expect } from '@playwright/test';
import { BrowserWindowsPage } from '../../src/Pages/BrowserWindowsPage'
test('Browser windows', async ({ page }) => {

    const browserWindows = new BrowserWindowsPage(page);

    await page.goto('https://demoqa.com/browser-windows');

    // Original tab
    const originalTab = page;

    // 1. Open new tab
    const newTab = await browserWindows.openNewTab();

    await newTab.waitForLoadState();

    // Switch/display new tab
    await newTab.bringToFront();

    await expect(newTab.locator('body'))
        .toContainText('This is a sample page');
        console.log("!st Url "+await page.url())

    // Switch back to ORIGINAL

    await originalTab.bringToFront();

    console.log('Now I am on original tab');



    const newWindow = await browserWindows.openNewWindow();

    await newWindow.waitForLoadState();

    await newWindow.bringToFront();

    await expect(newWindow.locator('body'))
        .toContainText('This is a sample page');
     console.log("!st Url "+await page.url())

    await newWindow.close();

    // Back to ORIGINAL

    await originalTab.bringToFront();
     console.log("!st Url "+await page.url())

    // 3. Open message window

    const messageWindow =
        await browserWindows.openMessageWindow();

    await messageWindow.waitForLoadState();

    await messageWindow.bringToFront();

    await expect(messageWindow.locator('body'))
        .toContainText(
            'Knowledge increases by sharing but not by saving.'
        );

    await messageWindow.close();

    // Finally back to ORIGINAL

    await originalTab.bringToFront();
     console.log("!st Url "+await page.url())
});
