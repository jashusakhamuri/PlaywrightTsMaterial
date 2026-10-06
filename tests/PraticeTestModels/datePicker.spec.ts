import { test, expect } from '@playwright/test';
import { DC } from '../../src/Pages/DateAndCalenderPage';

test.describe('Date Picker', () => {

  let datePicker: DC;

  test.beforeEach(async ({ page }) => {
    datePicker = new DC(page);

    await datePicker.goto();
  });

  test('Select Date', async () => {

    await datePicker.Calendar(
      'September',
      '2026',
      '23'
    );

    await expect(datePicker.dateInput)
      .toHaveValue('09/23/2026');
  });


  test('Select Current Date and Time', async () => {

    await datePicker.selectCurrentDateAndTime();

    console.log(
      'Selected Date & Time:',
      await datePicker.dateTimeInput.inputValue()
    );

  });

});