import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Select environment
 *
 * Default: qa
 *
 * Examples:
 * ENV=qa
 * ENV=qaauto
 * ENV=staging
 */
const environment = process.env.ENV || 'qa';

/**
 * Load environment file
 */
dotenv.config({
  path: path.resolve(
    __dirname,
    `src/config/environments/${environment}.env`
  )
});

/**
 * BASE_URL is mandatory
 */
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not defined in the environment file');
}

/**
 * Playwright configuration
 */
export default defineConfig({

  testDir: './tests',

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail CI if test.only is accidentally committed */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests on CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Reports
   *
   * HTML  -> playwright-report/
   * JUnit -> test-results/results.xml
   */
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      
       open: process.env.CI ? 'never' : 'always',
    }],

    // ['junit', {
    //   outputFile: 'test-results/results.xml'
    // }]
  ],

  /**
   * Shared settings
   */
  use: {

    /* Environment-based URL */
    baseURL: process.env.BASE_URL,

    /* Browser settings */
     headless: /*!process.env.CI, */ false,


    /* Screenshot only when test fails */
    screenshot: 'only-on-failure',

    /* Trace on retry */
    trace: 'on-first-retry',

    /* Video only when test fails */
    video: 'retain-on-failure'
  },

  /**
   * Browser projects
   */

projects: [

  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },

  {
    name: 'chromium',
    use: {
      browserName: 'chromium',
      viewport: null,
      launchOptions: {
        args: ['--start-maximized'],
      },
       storageState: 'playwright/.auth/user.json',
    },
    // dependencies: ['setup'],
  },

  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
  },

  {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
    },
  },
],
});