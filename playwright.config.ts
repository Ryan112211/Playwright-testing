const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    [
      'playwright-msteams-reporter',
      {
        webhookUrl: process.env.TEAMS_WEBHOOK_URL,
        webhookType: 'powerautomate', // This is key! Not 'msteams'
        linkToResultsUrl: process.env.REPORT_URL,
        linkUrlOnSuccess: true, // Show link even when tests pass
        mentionOnFailure: process.env.TEAMS_MENTION_ON_FAILURE, // Optional: 'user1@company.com,user2@company.com'
        mentionOnFailureText: '{mentions} - Tests failed! Please check.',
        enableEmoji: true,
      }
    ]
  ],
  
  use: {
    baseURL: 'https://example.com',  // Simple, stable test site
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',  // Record video on failures
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});