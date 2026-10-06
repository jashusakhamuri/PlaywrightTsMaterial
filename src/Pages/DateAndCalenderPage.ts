import {Page , expect , Locator} from '@playwright/test';

 export class DC{
    readonly page:Page;
    readonly  dateInput  : Locator;
    readonly dateTimeInput : Locator;
    readonly monthSelect : Locator;
    readonly yearsSelect : Locator;
    constructor(page:Page){
        this.page = page;
        this.dateInput = page.locator('#datePickerMonthYearInput');
        this.dateTimeInput = page.locator('#dateAndTimePickerInput');
        this.monthSelect = page.locator('.react-datepicker__month-select');
        this.yearsSelect = page.locator('.react-datepicker__year-select'); 
    }

    async goto(){
        await this.page.goto("https://demoqa.com/date-picker");
         console.log(await this.page.title())
    }

    async Calendar(month:string , year:string , date:string):Promise<void>{
        await this.dateInput.click();

        await this.monthSelect.selectOption({
      label: month
    });

    await this.yearsSelect.selectOption({label:year})
  
    await this.page.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').getByText(date, {exact:true}).click()

    }

async selectCurrentDateAndTime(): Promise<void> {

    const now = new Date();

    const date = now.getDate().toString();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // This picker shows 24-hour time with 15-minute intervals:
    // 15:15, 15:30, 15:45, 16:00 ...
    const roundedMinutes =
        minutes < 15 ? '00' :
        minutes < 30 ? '15' :
        minutes < 45 ? '30' : '45';

    const time = `${String(hours).padStart(2, '0')}:${roundedMinutes}`;

    console.log('Date:', date);
    console.log('Time to select:', time);

    await this.dateTimeInput.click();

    // Select today's date
    await this.page
        .locator(
            '.react-datepicker__day:not(.react-datepicker__day--outside-month)'
        )
        .filter({ hasText: date })
        .first()
        .click();

    // Make sure the time list is open before clicking
    await expect(
        this.page.locator('.react-datepicker__time-list')
    ).toBeVisible({ timeout: 10_000 });

    // Select the time in the format the list actually renders: "16:00"
    await this.page
        .locator('.react-datepicker__time-list-item', { hasText: time })
        .first()
        .click();
}

}