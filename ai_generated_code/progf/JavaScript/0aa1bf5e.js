// Accessing a Twilio API key from environment variables for sending SMS
const twilio = require('twilio')
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Written with routine coding tools-4-0125-preview
