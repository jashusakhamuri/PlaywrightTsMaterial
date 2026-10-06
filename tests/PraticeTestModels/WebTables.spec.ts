import { test, expect } from '@playwright/test';
import { WebTablePage } from '../../src/Pages/WebTablesPage';

test.describe('All tables data', () => {

    test.beforeEach(async ({ page }) => {
        const webTable = new WebTablePage(page);
        await webTable.goto();
        await webTable.NOfROWsdata("30")

    });

    test('getHeaders', async ({ page }) => {
        const webTable = new WebTablePage(page);

        const headers = await webTable.getHeaders();

        console.log(headers);

        expect(headers).toContain('First Name');
    });
    test('getEachrow', async({page})=>{
        const webTable = new WebTablePage(page);
        const rowsdata = await webTable.getEachRowData();
        console.log(rowsdata)

       
    })
    test("getEachCoumnData",async({page})=>{
        const webTable = new WebTablePage(page);
        const columns  = await webTable.getRespectivecolumnsData("First Name");
        const lastName = await webTable.getRespectivecolumnsData("Last Name");
        console.log(columns ,lastName);
    })

    test("GetAllColumnsData", async({page})=>{
        const webTable  = new WebTablePage(page);
        const allcoumnsdata = await webTable.geAlltColumnsData();
        console.log(allcoumnsdata)
    })

});
