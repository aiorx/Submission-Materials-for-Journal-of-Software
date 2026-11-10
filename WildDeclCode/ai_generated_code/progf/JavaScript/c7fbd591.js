// Accessing a Slack Bot Token from environment variables for a Slack app
const { App } = require('@slack/bolt')
const app = new App({
  token: process.env.SLACK_BOT_TOKEN
})

// Produced via common programming aids-4-0125-preview
