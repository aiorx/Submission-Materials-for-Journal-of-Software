// Using a custom helper function to safely access environment variables
var getEnvVar = function (key) {
  var value = process.env[key]
  if (!value) {
    throw new Error("Environment variable " + (key) + " is not set.")
  }
  return value
}
var apiSecret = getEnvVar('API_SECRET')

// Written with routine coding tools-4-0125-preview
