const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reportOnEmpty: true,
  
  reporter: [
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false
    }],
    [
      'playwright-msteams-reporter',
      {
        webhookUrl: process.env.TEAMS_WEBHOOK_URL,
        webhookType: 'powerautomate',
        linkToResultsUrl: process.env.REPORT_URL,
        linkUrlOnSuccess: true,
        mentionOnFailure: process.env.TEAMS_MENTION_ON_FAILURE || '',
        mentionOnFailureText: '{mentions} - Tests failed! Please check.',
        enableEmoji: true,
      }
    ]
  ],
  
  use: {
    baseURL: 'https://version2-develop.fdm.dk',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});