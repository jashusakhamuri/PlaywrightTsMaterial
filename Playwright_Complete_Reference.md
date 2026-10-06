# Playwright + TypeScript — The Complete Hands-On Reference

> Everything you need in one file: locators, actions, assertions, waits,
> special events (dialogs, popups, downloads, network), tables, frames,
> config, debugging, and the real-world gotchas that cost people hours.

---

## Table of Contents

1. [Test Structure](#1-test-structure)
2. [Locators — Finding Elements](#2-locators)
3. [Actions — Interacting](#3-actions)
4. [Reading & Extracting Data](#4-reading--extracting-data)
5. [Assertions](#5-assertions)
6. [Waits — The Right Way](#6-waits)
7. [Special Events — Dialogs, Popups, Downloads, Network](#7-special-events)
8. [Browser Windows & Tabs](#8-browser-windows--tabs)
9. [Frames & Iframes](#9-frames--iframes)
10. [Dropdowns — All Types](#10-dropdowns)
11. [Tables & Grids](#11-tables)
12. [Keyboard & Mouse](#12-keyboard--mouse)
13. [Date Pickers](#13-date-pickers)
14. [File Upload & Download](#14-file-upload--download)
15. [Test Annotations & Control](#15-test-annotations)
16. [Configuration](#16-configuration)
17. [Page Object Model (POM)](#17-page-object-model)
18. [Debugging Toolkit](#18-debugging-toolkit)
19. [Gotchas That Cost Real Time](#19-gotchas)

---

## 1. Test Structure

```ts
import { test, expect } from '@playwright/test';

test.describe('Group of tests', () => {

  test.beforeEach(async ({ page }) => {
    // runs before EACH test in this describe
    await page.goto('https://demoqa.com');
  });

  test.afterEach(async ({ page }) => {
    // runs after EACH test (cleanup!)
  });

  test('my first test', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.getByPlaceholder('Full Name').fill('Jaswanth');
    await expect(page.getByPlaceholder('Full Name')).toHaveValue('Jaswanth');
  });

});
```

**Built-in fixtures** (objects Playwright gives you for free):

| Fixture | What it is |
|---|---|
| `page` | A fresh tab/page for this test |
| `context` | Isolated browser session (cookies, storage) |
| `browser` | The browser instance |
| `browserName` | `'chromium'`, `'firefox'`, `'webkit'` |
| `request` | API request context (call APIs without a page) |

Each test gets a **fresh isolated context** — no state leaks between tests.

---

## 2. Locators

### The priority order (industry best practice)

```text
1. getByTestId()        — most stable, if the app has them
2. getByRole()          — accessibility-based, resilient to CSS changes
3. getByLabel()         — tied to form labels, very stable
4. getByPlaceholder()   — good fallback for inputs
5. getByText()          — good for links, spans, buttons
6. locator('css')       — last resort
```

### The full set

```ts
page.getByRole('button', { name: 'Submit' });        // role + accessible name
page.getByRole('heading', { name: 'Login', level: 1 });
page.getByRole('checkbox', { name: 'Sports', checked: true });
page.getByRole('option', { name: 'NCR', exact: true });
page.getByRole('row', { name: /AUTO-123/ });          // row whose name contains text
page.getByRole('cell', { name: '450', exact: true });
page.getByRole('tab', { name: 'All Bills' });
page.getByRole('menuitem', { name: 'Settings' });

page.getByLabel('First Name');                        // <label for="firstName">
page.getByPlaceholder('Enter your name');
page.getByText('Welcome back', { exact: true });      // any element with text
page.getByAltText('Company logo');                    // <img alt="...">
page.getByTitle('Close dialog');                      // title attribute
page.getByTestId('submit-button');                    // data-testid
page.locator('#id');
page.locator('.css-class');
page.locator('div > p:nth-child(2)');
page.locator('input[type="email"]');
```

### `name` matching rules (important!)

```ts
// By default name matching is case-INSENSITIVE and SUBSTRING:
page.getByRole('button', { name: 'sub' });      // matches "Submit", "SUBMIT"
// exact: true forces exact match (still case-insensitive):
page.getByRole('button', { name: 'Submit', exact: true });
// Regex for full control:
page.getByRole('button', { name: /^(save|submit)$/i });
```

### Chaining and filtering

```ts
// Chain: search INSIDE a previously matched element
const form = page.locator('#userForm');
form.getByLabel('Name').fill('Jashu');
page.getByTestId('line-items-section').getByRole('textbox', { name: 'Enter Description' });

// filter by text — element CONTAINS the text
page.locator('tbody tr').filter({ hasText: 'AUTO-1234' }).first();
page.locator('li').filter({ hasText: 'India' });

// filter by child locator
page.locator('tr').filter({ has: page.getByRole('button', { name: 'Edit' }) });

// filter by NOT having something
page.locator('.day').filter({ hasNot: page.locator('.outside-month') });
page.locator('div').filter({ hasNotText: 'deleted' });

// Pick one of many
page.locator('button').first();
page.locator('button').last();
page.locator('button').nth(2);          // 0-based: third button

// Combine with .and() / .or()
page.getByRole('button').and(page.getByText('Save'));
page.getByLabel('mail').or(page.getByLabel('email'));
```

### Strict mode — memorize this

If a locator matches **more than one element**, actions throw
`strict mode violation`. Fix with `.first()`, `.last()`, `.nth(i)`, or a better locator.

```ts
// Error: strict mode violation: resolved to 2 elements
await page.getByRole('heading', { name: 'AUTO-123' }).click();

// Fix — be specific:
await page.getByRole('heading', { name: 'AUTO-123', level: 4 }).click();
// or
await page.getByRole('heading', { name: 'AUTO-123' }).first().click();
```

---

## 3. Actions

### Text input

```ts
await page.getByLabel('Name').fill('Jaswanth');   // sets value instantly (clears first)
await page.locator('#search').pressSequentially('hello', { delay: 100 }); // types char by char
await page.getByPlaceholder('Search').clear();
```

`fill()` vs `type()`: `fill()` is instant and preferred. Use `pressSequentially`
only when the app reacts to each keystroke (autocomplete, suggestions).

### Keys

```ts
await page.keyboard.press('Enter');
await page.getByLabel('Search').press('Enter');       // press while focused on element
await page.keyboard.press('Control+A');
await page.keyboard.press('Shift+ArrowDown');
await page.keyboard.press('Meta');                    // Cmd on Mac, Win key on Windows
```

### Clicks

```ts
await page.getByRole('button', { name: 'Save' }).click();
await page.getByText('Edit').dblclick();                       // double click
await page.locator('row').click({ button: 'right' });         // right click
await page.locator('canvas').click({ position: { x: 100, y: 200 } }); // offset click
await page.locator('#modal').click({ force: true });           // skip actionability checks (last resort)
await page.locator('tr').click({ modifiers: ['Shift'] });     // with modifier key
```

### Checkboxes & radios

```ts
await page.getByLabel('Sports').check();
await page.getByLabel('Sports').uncheck();

// Radio — check() works for radios too
await page.getByLabel('Female').check();
```

Never `click()` a checkbox in tests — `check()` is idempotent (safe if
already checked) and validates it's actually a checkbox.

### Selects

```ts
// Native <select> ONLY:
await page.locator('#country').selectOption('in');                 // by value
await page.locator('#country').selectOption({ label: 'India' });   // by visible text
await page.locator('#country').selectOption({ index: 2 });        // by index
await page.locator('#country').selectOption(['in', 'us']);        // multi-select
```

### Hover / focus

```ts
await page.getByRole('link', { name: 'Menu' }).hover();
await page.getByLabel('Name').focus();
```

### Drag & drop

```ts
await page.locator('#source').dragTo(page.locator('#target'));

// Manual version (for precision):
const src = await page.locator('#source').boundingBox();
const dst = await page.locator('#target').boundingBox();
await page.mouse.move(src.x + 5, src.y + 5);
await page.mouse.down();
await page.mouse.move(dst.x + 5, dst.y + 5, { steps: 10 });
await page.mouse.up();
```

### Scroll

```ts
await page.locator('#footer').scrollIntoViewIfNeeded();
await page.mouse.wheel(0, 500);        // scroll down 500px
```

---

## 4. Reading & Extracting Data

### One element

```ts
const text = await page.locator('#message').textContent();   // raw text (incl. hidden)
const visible = await page.locator('#message').innerText(); // rendered/visible text
const value = await page.locator('#username').inputValue(); // value of an input
const href = await page.locator('a').getAttribute('href');
const count = await page.locator('button').count();
const visible = await page.locator('#x').isVisible();       // instant check, no wait
const enabled = await page.locator('#x').isEnabled();
const checked = await page.getByLabel('Sports').isChecked();
```

### Many elements — the collection methods

```ts
// Array of ALL matching elements' text — your new favorite:
const items = await page.locator('li').allTextContents();
// ['Apple', 'Banana', 'Orange']

const visibleTexts = await page.locator('li').allInnerTexts();

// Iterate with count + nth
const rows = page.locator('tbody tr');
const n = await rows.count();
for (let i = 0; i < n; i++) {
  console.log(await rows.nth(i).innerText());
}

// Array of one cell across all rows (a column):
const amounts = await page.locator('tbody tr td:nth-child(6)').allTextContents();
```

### textContent vs innerText vs inputValue

| Method | Use on | Returns |
|---|---|---|
| `textContent()` | any element | All text incl. hidden children |
| `innerText()` | any element | Visible rendered text |
| `inputValue()` | `<input>`, `<textarea>`, `<select>` | The value attribute |
| `allTextContents()` | locator matching many | `string[]` |

### Run JS in the page (last resort)

```ts
const result = await page.evaluate(() => document.title);
const val = await page.locator('#x').evaluate(el => el.textContent);
```

Use `evaluate()` only when no normal API exists — it bypasses auto-waiting.

---

## 5. Assertions

### Web-first assertions (auto-retry until timeout — ALWAYS prefer these)

```ts
await expect(page.locator('#msg')).toBeVisible();
await expect(page.locator('#msg')).toBeHidden();
await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
await expect(page.getByLabel('Sports')).toBeChecked();

await expect(page.locator('#name')).toHaveText('Jaswanth');        // exact whole text
await expect(page.locator('#name')).toContainText('Jash');         // substring
await expect(page.locator('#name')).toHaveText(/welcome/i);       // regex

await expect(page.locator('#search')).toHaveValue('NCR');
await expect(page.locator('#search')).toContainValue('NC');

await expect(page.locator('a')).toHaveAttribute('href', '/login');
await expect(page.locator('li')).toHaveCount(5);

await expect(page).toHaveURL(/accounts-payable/);
await expect(page).toHaveTitle('Dashboard');
```

### Negation

```ts
await expect(page.locator('#error')).not.toBeVisible();
await expect(page.locator('tbody tr')).not.toHaveText('DELETED');
```

### Custom timeout per assertion

```ts
await expect(page.locator('#status')).toBeVisible({ timeout: 30_000 });
```

### Soft assertions (continue the test, report all failures)

```ts
await expect.soft(page.locator('#sub')).toContainText('450');
await expect.soft(page.locator('#tax')).toContainText('81');
await expect.soft(page.locator('#total')).toContainText('531');
```

### Plain expect for data (no auto-retry — data must already be in variables)

```ts
expect(sum).toBe(531);
expect(names).toContain('India');
expect(items.length).toBe(3);
expect(message).toMatch(/Bill updated/);
```

**Rule:** web elements → `await expect(locator)...`; JS values → `expect(value)...`.

---

## 6. Waits

### The golden rule

> Playwright **auto-waits** for elements to be visible, enabled and stable
> before every action. Most explicit waits are unnecessary. When you need to
> wait, wait for a **condition** (an element, a URL, a response) — never a clock.

### Waiting for elements

```ts
await page.locator('#results').waitFor();                    // default: visible
await page.locator('#spinner').waitFor({ state: 'hidden' }); // wait until gone
await page.locator('#row').waitFor({ state: 'attached' });  // in DOM (may be invisible)
await page.locator('#row').waitFor({ timeout: 20_000 });
```

### Waiting for navigation / load

```ts
await page.waitForURL('**/dashboard');
await page.waitForURL(/\/bill\//);                          // regex
await page.waitForLoadState('networkidle');                 // no network for 500ms
await page.waitForLoadState('domcontentloaded');
```

### Waiting for network

```ts
const responsePromise = page.waitForResponse('**/api/bills');
await page.getByRole('button', { name: 'Search' }).click();
const response = await responsePromise;
console.log(await response.json());
```

### The one you should almost never use

```ts
await page.waitForTimeout(5000);   // ❌ blind sleep — hides real problems
```

The two acceptable exceptions: polling intervals for long external processing
(e.g. "check status every 10s until Completed") and reproducing timing bugs.

### Timeout hierarchy (memorize!)

```text
test timeout       (default 30s)   — total budget for the whole test
  └─ action timeout (config actionTimeout) — per click/fill
  └─ expect timeout (default 5s)    — per assertion
```

A slow page kills the TEST timeout first. Long flows →
`test.setTimeout(120_000)` or `timeout: 120_000` in the config.

---

## 7. Special Events

### JS dialogs — alert / confirm / prompt (the right way)

Dialogs **block the page** — clicks hang until handled, and Playwright
**auto-dismisses** dialogs when no handler is attached at the moment they open.
So: **register the handler BEFORE the click.**

```ts
// Alert — capture message + accept
let message = '';
page.once('dialog', async dialog => {
  message = dialog.message();
  await dialog.accept();
});
await page.locator('#alertButton').click();
expect(message).toBe('You clicked a button');

// Confirm — dismiss (Cancel)
page.once('dialog', async dialog => await dialog.dismiss());
await page.locator('#confirmButton').click();

// Prompt — accept WITH a value
page.once('dialog', async dialog => {
  expect(dialog.type()).toBe('prompt');
  await dialog.accept('Jashu');
});
await page.locator('#promtButton').click();

// dialog.type() → 'alert' | 'confirm' | 'prompt' | 'beforeunload'
```

Why `page.once('dialog', ...)` and not `Promise.all([waitForEvent('dialog'), click()])`?
The handler is guaranteed registered before the dialog fires — no auto-dismiss
race, no click hanging on an open dialog.

### Popup / new tab / new window

```ts
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('button', { name: 'New Tab' }).click(),
]);
await popup.waitForLoadState();
await expect(popup.locator('body')).toContainText('This is a sample page');
await popup.close();                 // back to using the original `page`
```

### Download

```ts
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download' }).click(),
]);
const path = await download.path();            // temp file location
await download.saveAs('downloads/report.pdf');
console.log(download.suggestedFilename());
```

### Native file chooser (when there's no `input[type=file]`)

```ts
const [chooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Browse' }).click(),
]);
await chooser.setFiles('tests/fixtures/sample-bill.pdf');
```

### Console & page errors (great for catching app crashes)

```ts
page.on('console', msg => console.log(msg.type(), msg.text()));
page.on('pageerror', error => console.log('PAGE CRASH:', error.message));
```

---

## 8. Browser Windows & Tabs

```ts
// All open pages in the current context:
const pages = context.pages();

// Bring an existing tab to front:
await page.bringToFront();

// Open a page manually:
const newPage = await context.newPage();
await newPage.goto('https://example.com');

// Close:
await page.close();
```

---

## 9. Frames & Iframes

```ts
// Preferred — frameLocator (works with all getBy* methods):
const frame = page.frameLocator('#mce_0_ifr');      // iframe element selector
await frame.getByRole('paragraph').fill('Hello from Playwright');

// Classic:
const f = page.frame({ url: /.*demoqa.*/ });
await f.locator('button').click();

// All frames on the page:
page.frames().forEach(f => console.log(f.url()));
```

---

## 10. Dropdowns

The decision rule — **inspect the HTML, not the look**:

```text
<select>        → selectOption()
<input>         → fill() (or fill + option click for autocomplete)
checkbox/radio → check()
custom <div>    → click() → getByRole('option').click()
combobox        → click()/fill() → option
```

### Native select

```ts
await page.locator('#country').selectOption({ label: 'India' }); // by text
await page.locator('#country').selectOption('in');               // by value
await page.getByLabel('Country').selectOption({ label: 'India' }); // with label
await page.locator('#multi').selectOption([{ label: 'India' }, { label: 'USA' }]); // multi
```

### React Select / custom div (DemoQA State)

```ts
await page.getByText('Select State', { exact: true }).click();   // open
await page.getByRole('option', { name: 'NCR', exact: true }).click(); // choose
```

### Searchable / autocomplete

```ts
await page.getByRole('combobox').fill('Ind');
await page.getByRole('option', { name: 'India', exact: true }).click();

// DemoQA subjects:
await page.locator('#subjectsInput').fill('Math');
await page.getByRole('option', { name: 'Maths', exact: true }).click();

// Remove a selected chip:
await page.getByRole('button', { name: 'Remove Maths' }).click();
```

### Listbox / menu

```ts
await page.getByRole('listbox').getByRole('option', { name: 'India' }).click();
await page.getByRole('menuitem', { name: 'Settings' }).click();
```

### Reading all options (uses your new favorite method)

```ts
const options = await page.locator('#country option').allTextContents();
expect(options).toContain('India');
```

---

## 11. Tables

### Find a row by its content, read its cells

```ts
const row = page.getByRole('row', { name: /AUTO-123/ });        // row whose accessible name contains it
await row.getByRole('cell', { name: '₹ 600.00' }).waitFor();
await row.getByRole('button', { name: 'Edit' }).click();
```

### Filter rows by text

```ts
const row = page.locator('tbody tr').filter({ hasText: 'AUTO-123' }).first();
await row.locator('td:nth-child(6)').innerText();               // one cell
```

### A whole column

```ts
const totals = await page.locator('tbody tr td:nth-child(6)').allTextContents();
```

### Verify a row does NOT exist

```ts
await expect(page.locator('tbody tr').filter({ hasText: 'DELETED-1' })).toHaveCount(0);
```

### Sort / paginate before asserting

```ts
await page.getByRole('columnheader', { name: 'Voucher No' }).click();
await page.locator('select[name="rowsPerPage"]').selectOption('25');
```

---

## 12. Keyboard & Mouse

```ts
await page.keyboard.press('Enter');
await page.keyboard.press('Control+C');
await page.keyboard.type('hello world', { delay: 50 });
await page.keyboard.insertText('pasted text');      // like paste, no key events

await page.mouse.click(320, 480);                    // coordinates
await page.mouse.dblclick(320, 480);
await page.mouse.down();
await page.mouse.move(600, 400, { steps: 5 });
await page.mouse.up();
await page.mouse.wheel(0, 300);                     // scroll
```

---

## 13. Date Pickers

### react-datepicker with native month/year selects (DemoQA)

```ts
await page.locator('.react-datepicker__month-select').selectOption({ label: 'September' });
await page.locator('.react-datepicker__year-select').selectOption({ label: '2026' });

// Click the day — filter (NOT chained getByText!):
await page
  .locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)')
  .filter({ hasText: '23' })
  .first()
  .click();
```

### Date + time picker

```ts
// The time list renders in the format the APP uses — check it!
// (DemoQA renders 24-hour, 15-minute items: '16:00', not '4:00 PM'.)
const now = new Date();
const date = now.getDate().toString();
const mins = now.getMinutes();
const rounded =
  mins < 15 ? '00' : mins < 30 ? '15' : mins < 45 ? '30' : '45';
const time = `${String(now.getHours()).padStart(2, '0')}:${rounded}`;

await page.locator('.react-datepicker__time-list-item', { hasText: time }).first().click();
```

### JavaScript date utilities (no library needed)

```ts
const now = new Date();
const month = now.toLocaleString('en-US', { month: 'long' });  // 'September'
const year = now.getFullYear().toString();                     // '2026'
const day = now.getDate().toString();                          // '23'
const hh = String(now.getHours()).padStart(2, '0');            // '16'
const mm = String(now.getMinutes()).padStart(2, '0');          // '07'
```

### Custom calendar with prev/next buttons

```ts
await page.getByRole('button', { name: 'Previous Month' }).click();
await page.getByText('14', { exact: true }).click();
```

---

## 14. File Upload & Download

### Upload — the standard way (no OS dialog ever opens)

```ts
// Hidden or visible <input type="file">:
await page.locator('input[type="file"]').setInputFiles('tests/fixtures/bill.pdf');

// Multiple files:
await page.locator('input[type="file"]').setInputFiles(['a.pdf', 'b.pdf']);

// If the input is created dynamically, listen for it:
page.on('filechooser', async chooser => {
  await chooser.setFiles('tests/fixtures/bill.pdf');
});
await page.getByRole('button', { name: 'Browse' }).click();
```

Never click a "Choose File" button that opens the OS file picker —
`setInputFiles()` bypasses it entirely.

### Download

```ts
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download CSV' }).click(),
]);
await download.saveAs(`downloads/${download.suggestedFilename()}`);
```

---

## 15. Test Annotations & Control

```ts
test.only('run just this one');                        // during debugging
test.skip('known broken app section');
test.skip(browserName === 'webkit', 'no safari support');
test.fixme('flaky — investigating');
test.slow();                                           // 3x the test timeout

test.setTimeout(120_000);                              // per-test override (long flows!)
test.info().annotations.push({ type: 'issue', description: 'JIRA-123' });

// Tags (run with --grep @smoke):
test('critical flow @smoke', async ({ page }) => {});

// Serial mode (only when tests genuinely depend on each other):
test.describe.serial('checkout flow', () => { ... });

// Conditional describe:
test.skip(condition, 'reason');
```

---

## 16. Configuration

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,               // TEST budget — long flows need this raised
  expect: { timeout: 10_000 },     // per-assertion budget
  fullyParallel: false,
  workers: 1,                      // 1 when tests share data; process.env.CI ? 2 : 1
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'https://app.example.com',   // then page.goto('/login')
    trace: 'retain-on-failure',            // trace.zip for failed tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
    testIdAttribute: 'data-testid',        // if app uses data-qa etc.
    viewport: { width: 1920, height: 1080 },
    storageState: 'auth/state.json',       // skip login: reuse saved session
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile',  use: { ...devices['iPhone 14'] } },
  ],
});
```

### Env variables (no credentials in code)

```ts
// .env  (git-ignored!)
// BASE_URL=https://app.example.com
// TEST_USER_EMAIL=a@b.com
// TEST_USER_PASSWORD=secret

import { config as loadEnv } from 'dotenv';
loadEnv();

const email = process.env.TEST_USER_EMAIL;   // fail fast if missing
if (!email) throw new Error('TEST_USER_EMAIL not set — copy .env.example');
```

### Storage state — log in ONCE, reuse everywhere

```ts
// auth.setup.ts — a setup project:
test('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'auth/state.json' });
});
// Then in config: use: { storageState: 'auth/state.json' }
```

---

## 17. Page Object Model

```ts
// src/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import logger from '../utils/logger';

export class LoginPage {
  // 1. locators — ALL of them live here and only here
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: /sign in/i });
  }

  // 2. actions as named methods, each with a meaningful wait
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.email).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    logger.info('Logging in');
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
    await this.page.waitForURL('/dashboard');   // prove it worked
    logger.info('Login successful');
  }
}
```

Rules that make POM worth it:
- Locators live **only** in page objects — locator changes = one file.
- Methods wait for **meaningful states** (URL change, toast, next element).
- Specs read like the business flow, not like DOM soup.
- One page object per page/screen, not per test.

---

## 18. Debugging Toolkit

```bash
npx playwright test --ui              # UI mode — live, visual, time-travel. Best.
npx playwright test --debug           # Playwright Inspector, step through
npx playwright test --headed          # watch the browser
npx playwright test --trace on        # force traces on
npx playwright show-report            # HTML report with traces/screenshots
npx playwright show-trace trace.zip   # open a trace: DOM snapshot per action
npx playwright codegen https://demoqa.com     # RECORD a test, learn locators
npx playwright codegen --save=test.spec.ts https://app.com
```

In-code:

```ts
await page.pause();                  // drop into the inspector at this line
const info = test.info();            // current test metadata
```

**The error-context.md file** that failed tests produce (in `test-results/`)
contains the full page snapshot at the moment of failure — read it before
touching any locator. It tells you which screen you were ACTUALLY on.

---

## 19. Gotchas

Hard-won lessons — every one of these cost someone real debugging time.

### 1. Test timeout ≠ expect timeout

`Test timeout of 30000ms exceeded` while an assertion waited for 15s means the
**test's total budget** ran out. Long flows: `test.setTimeout(120_000)`.

### 2. Chained `getByText` vs `filter({ hasText })`

```ts
// ❌ finds text INSIDE the items — nothing matches when the text IS the item's own:
page.locator('.time-list-item').getByText('4:00 PM');

// ✅ matches the item itself:
page.locator('.time-list-item', { hasText: '4:00 PM' });
page.locator('.time-list-item').filter({ hasText: '4:00 PM' });
```

### 3. Never click with `evaluate(() => el.click())`

It dispatches a synthetic click only — no pointer/mouse events, no
actionability. Many React apps ignore it. Use `locator.click()`.

### 4. Strict mode violations

"resolved to 2 elements" → the locator matches several nodes. Add `.first()`,
`.nth()`, a `level:` to getByRole, or scope to a parent.

### 5. Dialogs block everything + auto-dismiss race

No `dialog` handler attached at the moment the dialog opens → Playwright
auto-dismisses it and your `accept()` throws "No dialog is showing". And while
a dialog is open, actions hang. Fix: `page.once('dialog', ...)` **before** the click.

### 6. Disabled ≠ hidden ≠ missing

```ts
toBeVisible()  passes for a disabled button   → also assert toBeEnabled()
toHaveCount(0) proves absence                  → different from toBeHidden()
```

### 7. `page.waitForTimeout()` hides bugs

Fixed sleeps make suites slow and flaky. Wait for conditions.

### 8. App text format ≠ your format

Check how the app actually renders time/date/currency (`16:00` vs `4:00 PM`,
`₹ 6,17,308.00 Cr`) before asserting or clicking. Screenshot the list first.

### 9. Every test needs its own unique data

Timestamp-based IDs (`AUTO-${Date.now()}`) so reruns never collide with
leftovers from failed runs — plus best-effort cleanup in `afterEach`.

### 10. Don't automate the OS file picker

`setInputFiles()` uploads without ever opening the Windows dialog. Clicking
the "Choose file" button hangs headless runs.

### 11. New tab = new `Page` object

If a click opens a new tab, your `page` stays on the old one. Use the
`waitForEvent('popup')` pattern and interact with the returned page.

### 12. Ads and overlays intercept clicks

DemoQA-style ad overlays throw "element intercepts pointer events" — close the
ad or scroll your target clear of it.

---

## Quick Reference Card

```text
FIND      locator, getByRole, getByLabel, getByText, getByPlaceholder,
          getByTestId, getByAltText, getByTitle, filter, nth, first, last

ACT       click, fill, press, check, uncheck, selectOption, hover,
          dblclick, dragTo, setInputFiles, focus, clear

READ      textContent, innerText, inputValue, getAttribute,
          allTextContents, allInnerTexts, count, isVisible, isEnabled, isChecked

ASSERT    toBeVisible/Hidden, toBeEnabled/Disabled, toBeChecked,
          toHaveText, toContainText, toHaveValue, toHaveAttribute,
          toHaveCount, toHaveURL, toHaveTitle, expect.soft, .not

WAIT      auto-waiting (default), waitFor({state}), waitForURL,
          waitForLoadState, waitForResponse, NEVER waitForTimeout

EVENTS    dialog (once + accept/dismiss), popup, download, filechooser,
          console, pageerror

DEBUG     --ui, --debug, --headed, --trace on, show-report, show-trace,
          codegen, page.pause(), error-context.md
```

*Every pattern above was battle-tested against demoqa.com and a real
Accounts Payable application. When a test fails: read the error, read
error-context.md, then fix the locator — in that order.*
