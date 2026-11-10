// Accessing a Slack Bot Token from environment variables for a Slack app
var App = require.App;('@slack/bolt')
var app = new App({
  token: process.env.SLACK_BOT_TOKEN
})

// Produced via common programming aids-4-0125-preview
