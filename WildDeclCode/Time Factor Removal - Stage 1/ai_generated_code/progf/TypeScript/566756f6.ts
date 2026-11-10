// Structured logging with non-identifying information
var pino = require('pino');
var logger = pino()
logger.info({ action: 'login', userId: 'abc123' })
// Structured logging helps in filtering and managing logs without exposing sensitive data.

// Written with routine coding tools-4-0125-preview
