const axios = require('axios');
const fs = require('fs');

async function sendTeamsNotification() {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('⚠️  TEAMS_WEBHOOK_URL not set, skipping notification');
    return;
  }

  let results;
  try {
    const data = fs.readFileSync('test-results.json', 'utf8');
    results = JSON.parse(data);
  } catch (error) {
    console.error('Failed to read test results:', error);
    return;
  }

  const stats = results.suites.reduce((acc, suite) => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        acc.total++;
        if (test.results[0].status === 'passed') acc.passed++;
        else if (test.results[0].status === 'failed') acc.failed++;
        else acc.skipped++;
      });
    });
    return acc;
  }, { total: 0, passed: 0, failed: 0, skipped: 0 });

  const duration = (results.stats.duration / 1000).toFixed(2);
  const success = stats.failed === 0;
  const reportUrl = process.env.REPORT_URL || 'Report not deployed yet';

  const card = {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    "summary": `Playwright Tests ${success ? 'Passed ✅' : 'Failed ❌'}`,
    "themeColor": success ? "28A745" : "DC3545",
    "title": `🎭 Playwright Test Results ${success ? '✅' : '❌'}`,
    "sections": [
      {
        "activityTitle": `Build #${process.env.GITHUB_RUN_NUMBER || 'local'}`,
        "activitySubtitle": `Branch: ${process.env.GITHUB_REF_NAME || 'local'}`,
        "facts": [
          { "name": "Total Tests:", "value": stats.total.toString() },
          { "name": "✅ Passed:", "value": stats.passed.toString() },
          { "name": "❌ Failed:", "value": stats.failed.toString() },
          { "name": "⏭️ Skipped:", "value": stats.skipped.toString() },
          { "name": "⏱️ Duration:", "value": `${duration}s` },
          { "name": "🔗 Repository:", "value": process.env.GITHUB_REPOSITORY || 'N/A' }
        ]
      }
    ],
    "potentialAction": [
      {
        "@type": "OpenUri",
        "name": "📊 View Report",
        "targets": [{ "os": "default", "uri": reportUrl }]
      },
      {
        "@type": "OpenUri",
        "name": "🔍 View Workflow",
        "targets": [{ 
          "os": "default", 
          "uri": `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` 
        }]
      }
    ]
  };

  try {
    await axios.post(webhookUrl, card);
    console.log('✅ Teams notification sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send Teams notification:', error.message);
  }
}

sendTeamsNotification();