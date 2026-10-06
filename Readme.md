


i learn about the allTextContents();  it give all contents in form array we can traverse that 

# Playwright Dropdown Types — Industry Standard Cheat Sheet

## 1. Native `<select>` Dropdown

### HTML

```html
<select id="country">
    <option value="in">India</option>
    <option value="us">USA</option>
</select>
```

### Playwright

```ts
// Select by visible text
await page.locator('#country').selectOption({
    label: 'India'
});

// Select by value
await page.locator('#country').selectOption('in');

// Select by value explicitly
await page.locator('#country').selectOption({
    value: 'in'
});
```

**Use:** `selectOption()`

---

## 2. Native `<select>` with Label

### HTML

```html
<label for="country">Country</label>

<select id="country">
    <option value="in">India</option>
    <option value="us">USA</option>
</select>
```

### Playwright

```ts
await page
    .getByLabel('Country')
    .selectOption({
        label: 'India'
    });
```

**Use:** `getByLabel()` + `selectOption()`

---

# 3. React Select / Custom Dropdown

This is what you encountered in **DemoQA State**.

### Typical HTML

```html
<div id="state">
    <div class="css-13cymwt-control">
        <div>
            Select State
        </div>
    </div>
</div>
```

This is a `<div>`, **not `<select>`**.

### ❌ Don't use

```ts
await page.locator('#state').fill('NCR');

await page.locator('#state').selectOption('NCR');
```

### ✅ Use

```ts
// Open dropdown
await page.getByText('Select State', {
    exact: true
}).click();

// Select option
await page.getByRole('option', {
    name: 'NCR',
    exact: true
}).click();
```

**Pattern:**

```text
click dropdown
      ↓
dropdown opens
      ↓
getByRole('option')
      ↓
click option
```

---

# 4. Custom Dropdown with `combobox`

Some applications use:

```html
<div role="combobox">
    Select Country
</div>
```

or:

```html
<input role="combobox">
```

### Playwright

```ts
const dropdown = page.getByRole('combobox');

await dropdown.click();

await page.getByRole('option', {
    name: 'India',
    exact: true
}).click();
```

**Use:**

```ts
getByRole('combobox')
```

---

# 5. Searchable Dropdown

A searchable dropdown allows the user to type.

### Example

```text
Select Country
      ↓
type "Ind"
      ↓
India
Indonesia
```

### Playwright

```ts
const dropdown = page.getByRole('combobox');

await dropdown.fill('Ind');

await page.getByRole('option', {
    name: 'India',
    exact: true
}).click();
```

**Pattern:**

```text
fill()
  ↓
option appears
  ↓
click()
```

---

# 6. Autocomplete

Example from DemoQA:

```html
<input id="subjectsInput">
```

User types:

```text
Math
```

Dropdown displays:

```text
Maths
```

### Playwright

```ts
const subjectInput = page.locator('#subjectsInput');

await subjectInput.fill('Math');

await page.getByRole('option', {
    name: 'Maths',
    exact: true
}).click();
```

**Pattern:**

```text
input
 ↓
fill()
 ↓
option
 ↓
click()
```

---

# 7. Multi-Select Dropdown

Allows multiple values:

```text
Hindi
Maths
English
```

### Playwright

```ts
await page.getByRole('combobox').click();

await page.getByRole('option', {
    name: 'Hindi',
    exact: true
}).click();

await page.getByRole('combobox').click();

await page.getByRole('option', {
    name: 'Maths',
    exact: true
}).click();
```

---

# 8. Checkbox Dropdown

Some dropdowns contain checkboxes.

### Example

```text
Select Countries

☐ India
☐ USA
☐ UK
```

### Playwright

```ts
await page.getByText('Select Countries').click();

await page.getByLabel('India').check();

await page.getByLabel('USA').check();
```

**Use:**

```ts
getByLabel()
check()
```

---

# 9. Button Dropdown

Some applications use a button to open the dropdown.

### HTML

```html
<button>Select Country</button>

<ul>
    <li>India</li>
    <li>USA</li>
</ul>
```

### Playwright

```ts
await page.getByRole('button', {
    name: 'Select Country'
}).click();

await page.getByText('India', {
    exact: true
}).click();
```

**Pattern:**

```text
button
  ↓
click()
  ↓
option
  ↓
click()
```

---

# 10. Menu Dropdown

Example:

```text
Profile
   ↓
Account
Settings
Logout
```

### Playwright

```ts
await page.getByRole('button', {
    name: 'Profile'
}).click();

await page.getByRole('menuitem', {
    name: 'Settings'
}).click();
```

**Use:**

```ts
getByRole('menuitem')
```

---

# 11. Listbox

### HTML

```html
<div role="listbox">

    <div role="option">
        India
    </div>

    <div role="option">
        USA
    </div>

</div>
```

### Playwright

```ts
await page.getByRole('listbox').click();

await page.getByRole('option', {
    name: 'India',
    exact: true
}).click();
```

---

# 12. Date Picker — Native Month/Year Select

DemoQA's normal **Date Picker** uses:

```html
<select class="react-datepicker__month-select">
```

and:

```html
<select class="react-datepicker__year-select">
```

### Playwright

```ts
await page
    .locator('.react-datepicker__month-select')
    .selectOption({
        label: 'January'
    });

await page
    .locator('.react-datepicker__year-select')
    .selectOption({
        label: '2004'
    });
```

Then select the day:

```ts
await page
    .locator(
        '.react-datepicker__day:not(.react-datepicker__day--outside-month)'
    )
    .getByText('14', {
        exact: true
    })
    .click();
```

---

# 13. Custom Calendar

Some applications don't use `<select>` for month/year.

Example:

```text
< January >
```

or:

```text
Month
   ↓
January
February
March
```

In that case:

### ❌ Don't use

```ts
selectOption()
```

### ✅ Use

```ts
await page.getByText('January', {
    exact: true
}).click();
```

or:

```ts
await page.getByRole('button', {
    name: 'January'
}).click();
```

depending on the HTML.

---

# 14. `<input list="">` / `<datalist>`

### HTML

```html
<input list="countries" id="country">

<datalist id="countries">
    <option value="India">
    <option value="USA">
</datalist>
```

### Playwright

```ts
await page
    .locator('#country')
    .fill('India');
```

This is **not** a normal `<select>`.

---

# 15. Native Multi-Select `<select>`

### HTML

```html
<select id="countries" multiple>

    <option value="in">
        India
    </option>

    <option value="us">
        USA
    </option>

    <option value="uk">
        UK
    </option>

</select>
```

### Playwright

```ts
await page
    .locator('#countries')
    .selectOption([
        {
            label: 'India'
        },
        {
            label: 'USA'
        }
    ]);
```

---

# Quick Decision Cheat Sheet

| Type                    | HTML / Identification  | Playwright                        |
| ----------------------- | ---------------------- | --------------------------------- |
| Native dropdown         | `<select>`             | `selectOption()`                  |
| Native dropdown + label | `<label>` + `<select>` | `getByLabel().selectOption()`     |
| React Select            | Usually `<div>`        | `click()` → `getByRole('option')` |
| Combobox                | `role="combobox"`      | `getByRole('combobox')`           |
| Searchable dropdown     | Input/combobox         | `fill()` → option                 |
| Autocomplete            | `<input>`              | `fill()` → option                 |
| Multi-select custom     | Multiple options       | `click()` → option → repeat       |
| Checkbox dropdown       | Checkbox options       | `getByLabel().check()`            |
| Button dropdown         | `<button>`             | `click()` → option                |
| Menu dropdown           | `menu/menuitem`        | `getByRole()`                     |
| Listbox                 | `role="listbox"`       | `getByRole('option')`             |
| Native Date Picker      | `<select>` month/year  | `selectOption()`                  |
| Custom Calendar         | Buttons/divs           | `click()`                         |
| Datalist                | `<datalist>`           | `fill()`                          |
| Native multi-select     | `<select multiple>`    | `selectOption([...])`             |

---

# 🔥 Most Important Rule

**Don't decide the Playwright method from how the dropdown looks. Inspect the HTML first.**

### If you see:

```html
<select>
```

Use:

```ts
selectOption()
```

### If you see:

```html
<input>
```

Usually use:

```ts
fill()
```

### If you see:

```html
<div>
```

Usually:

```ts
click()
```

then:

```ts
getByRole('option').click()
```

### If you see:

```html
<input type="checkbox">
```

Use:

```ts
check()
```

### If you see:

```html
<input type="radio">
```

Use:

```ts
check()
```

---

## DemoQA State — Your Exact Case

Your screenshot showed a React Select:

```html
<div id="state">
    <div class="css-13cymwt-control">
        ...
        Select State
    </div>
</div>
```

Therefore:

```ts
// Constructor
this.state = page.getByText('Select State', {
    exact: true
});
```

Then:

```ts
// Page Object method
async stateSelect(state: string): Promise<void> {

    await this.state.click();

    await this.page.getByRole('option', {
        name: state,
        exact: true
    }).click();
}
```

And the test:

```ts
await formPage.stateSelect('NCR');
```

**Remember this core pattern:**

```text
<select>       → selectOption()

<input>        → fill()

checkbox       → check()

radio          → check()

custom div     → click() → option → click()

combobox       → fill/click() → option

autocomplete   → fill() → option
```

This distinction will cover most dropdowns you encounter in Playwright projects.
Yes bro. Yesterday we mainly discussed these **Playwright + TypeScript automation topics**:

# Playwright Topics We Discussed

## 1. Browser Windows / New Tab

DemoQA:

```text
https://demoqa.com/browser-windows
```

We discussed:

* New tab
* New window
* Message window
* `page.waitForEvent('popup')`
* `Promise.all()`
* Switching between `Page` objects
* Closing popup
* Continuing with original page

### Main pattern

```ts
const [newWindow] = await Promise.all([
  page.waitForEvent('popup'),
  windowButton.click()
]);

await newWindow.waitForLoadState();

await expect(newWindow.locator('body'))
  .toContainText('This is a sample page');

await newWindow.close();
```

Important:

```text
Main Page
   ↓
click button
   ↓
Popup Page
   ↓
validate
   ↓
close popup
   ↓
Main Page continues
```

---

# 2. Alerts / Browser Dialogs

DemoQA:

```text
https://demoqa.com/alerts
```

We covered:

* Alert
* Confirm
* Prompt
* Timer Alert
* `page.once('dialog')`
* `page.on('dialog')`
* `dialog.accept()`
* `dialog.dismiss()`
* `dialog.message()`
* `dialog.type()`

### Alert

```ts
page.once('dialog', async dialog => {
  console.log(dialog.message());

  expect(dialog.type()).toBe('alert');

  await dialog.accept();
});

await alertButton.click();
```

### Prompt

```ts
page.once('dialog', async dialog => {

  expect(dialog.type()).toBe('prompt');

  console.log(dialog.message());

  await dialog.accept('Jashu');
});

await promptButton.click();
```

### Confirm

```ts
page.once('dialog', async dialog => {

  expect(dialog.type()).toBe('confirm');

  await dialog.dismiss();
});

await confirmButton.click();
```

### Timer Alert

```ts
page.once('dialog', async dialog => {

  expect(dialog.message())
    .toBe('This alert appeared after 5 seconds');

  await dialog.accept();
});

await timerAlertButton.click();
```

We also discussed why:

```ts
page.waitForEvent('dialog')
```

was causing your DemoQA click to hang in your particular implementation, and we switched to:

```ts
page.once('dialog', ...)
```

---

# 3. Date Picker

DemoQA:

```text
https://demoqa.com/date-picker
```

We covered:

### Select Date

```ts
await this.dateInput.click();

await this.monthSelect.selectOption({
  label: 'January'
});

await this.yearsSelect.selectOption({
  label: '2004'
});

await this.page
  .locator(
    '.react-datepicker__day:not(.react-datepicker__day--outside-month)'
  )
  .getByText('14', { exact: true })
  .click();
```

Important locator:

```ts
'.react-datepicker__month-select'
```

and:

```ts
'.react-datepicker__year-select'
```

We also learned why the `.` matters:

```ts
// ❌ Wrong
page.locator('react-datepicker__month-select')

// ✅ Correct
page.locator('.react-datepicker__month-select')
```

---

# 4. Current Date & Time

We discussed using **native JavaScript `Date`**, without an external date library.

```ts
const now = new Date();

const month = now.toLocaleString('en-US', {
  month: 'long'
});

const year = now.getFullYear().toString();

const date = now.getDate().toString();

const hours = String(now.getHours()).padStart(2, '0');

const minutes = String(now.getMinutes()).padStart(2, '0');

const currentTime = `${hours}:${minutes}`;
```

Example:

```text
new Date()
    ↓
September
2026
23
16:07
```

We also discussed the difference between **24-hour JavaScript time** and DemoQA's **12-hour displayed time**.

---

# 5. Form Automation

Today we also continued with DemoQA:

```text
https://demoqa.com/automation-practice-form
```

We covered:

* Text fields
* Radio buttons
* Checkboxes
* Date of Birth
* Subjects autocomplete
* State dropdown
* City dropdown
* POM structure

### Text field

```ts
await this.firstName.fill('Jaswanth');
```

### Radio button

```ts
this.Gender = page.getByLabel('Female');

await this.Gender.check();
```

### Checkbox

```ts
this.HobbiesCheckBox = page.getByLabel('Sports');

await this.HobbiesCheckBox.check();
```

---

# 6. Autocomplete

We discussed DemoQA Subjects:

```ts
await this.multipleSubjects.fill('Math');

await this.page.getByRole('option', {
  name: 'Maths',
  exact: true
}).click();
```

And removing a selected value:

```ts
await this.page.getByRole('button', {
  name: `Remove ${subj}`
}).click();
```

---

# 7. Dropdown Types

We then expanded this into a general Playwright dropdown cheat sheet.

Main types:

```text
1. Native <select>
2. Native <select> + label
3. React Select / Custom dropdown
4. Combobox
5. Searchable dropdown
6. Autocomplete
7. Multi-select
8. Checkbox dropdown
9. Button dropdown
10. Menu dropdown
11. Listbox
12. Date/Calendar dropdown
13. Datalist
```

The most important rule we discussed:

```text
<select>       → selectOption()

<input>        → fill()

checkbox       → check()

radio          → check()

custom <div>   → click() → option → click()

combobox       → click/fill() → option
```

---

# 8. DemoQA State Dropdown

Your screenshot showed that **State is a React Select/custom dropdown**, not a normal `<select>`.

So this was wrong:

```ts
await this.state.fill('NCR');
```

because the locator resolved to:

```html
<div class="css-13cymwt-control">
```

Instead:

```ts
await this.state.click();

await this.page.getByRole('option', {
  name: 'NCR',
  exact: true
}).click();
```

---
These are all building blocks toward the **industry-standard Playwright POM framework** you've been practicing.

