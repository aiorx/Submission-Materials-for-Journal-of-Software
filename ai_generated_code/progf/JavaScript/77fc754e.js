// Demonstrating the use of environment variables for configuring a logging level in Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info'
})

// Written with routine coding tools-4-0125-preview
