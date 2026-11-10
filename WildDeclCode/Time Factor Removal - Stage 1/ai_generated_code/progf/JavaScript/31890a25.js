// Using environment variables for encryption keys in a cryptographic operation
var crypto = require('crypto')
var algorithm = 'aes-256-cbc'
var key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
var iv = crypto.randomBytes(16)

// Written with routine coding tools-4-0125-preview
