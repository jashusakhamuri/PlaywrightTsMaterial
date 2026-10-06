
import {Page, Locator , expect,} from"@playwright/test"

export class WebTablePage{
    readonly page : Page;
    readonly WebTable : Locator;
    readonly Heades : Locator;
    readonly body : Locator;

    constructor(page:Page){
        this.page  = page;
        this.WebTable  =page.locator('.-striped.-highlight.table.table-striped.table-bordered.table-hover');
        this.Heades =  this.WebTable.locator('thead th');
        this.body = this.WebTable.locator('tbody')

}
async goto(){
    await this.page.goto("https://demoqa.com/webtables");

}
async NOfROWsdata(rows:string){
    await this.page.locator("//select[@class='form-control']").selectOption(rows)

}

async getHeaders(): Promise<string[]>{
    return await this.Heades.allTextContents()
}

async getEachRowData(): Promise<string[][]>{
    const rows = this.body.locator('tr')
    const rowCount  = await rows.count();
    console.log(rowCount)
    const allRows: string[][] = [];
    for (let i  = 0 ; i < rowCount; i++){
        const cells  = rows.nth(i).locator('td');
        const rowData = await cells.allTextContents();
        allRows.push(rowData)
    }

return allRows
   
}

async getRespectivecolumnsData(columnName: string): Promise<string[]>{
    const headers = await this.Heades.allTextContents(); // it will take all headers
     const columnIndex = headers.findIndex(
        header => header.trim() === columnName
    );
    if (columnIndex === -1) {
        throw new Error(`Column "${columnName}" not found`);
    }
    const rows  = this.body.locator('tr');
    const columnData : string[] = [];
    for (let i = 0 ;i < await rows.count(); i++){

         const cell = rows.nth(i).locator('td').nth(columnIndex)
         columnData.push((await cell.innerText()).trim())
         
    }
      return columnData;

}

async geAlltColumnsData() : Promise<string[][]>{
    const rows  =  await this.body.locator('tr');
    const rowCount = await rows.count();
    const firstRowsCells = rows.nth(0).locator('td')
    const columncount  = await firstRowsCells.count();

    const allCoulmnsData : string[][] = []
    for (let col = 0; col< columncount ; col++){
        const columnsData: string[] =[];
        for(let row = 0 ; row < rowCount ; row++){
            const cell = rows.nth(row).locator('td').nth(col);
            columnsData.push((await  cell.innerText()).trim())
        }
        allCoulmnsData.push(columnsData)
    }

    return allCoulmnsData;

}

}
