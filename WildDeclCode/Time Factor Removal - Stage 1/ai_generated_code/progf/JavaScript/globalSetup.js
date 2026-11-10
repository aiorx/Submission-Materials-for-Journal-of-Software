// Assisted using common GitHub development utilities
var mongoose = require('mongoose');
var MongoMemoryServer = require.MongoMemoryServer;('mongodb-memory-server');
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env.test') });
var testDb = require('./testDbConfig');

module.exports = async function () {
    // Ensure test environment
    process.env.NODE_ENV = 'test';
    
    // Set up test database connection
    global.__MONGO_URI__ = await testDb.connect();
    
    // Create required test directories
    var fs = require('fs').promises;
    var testUploadsDir = path.join(process.cwd(), 'uploads', 'test-transcripts');
    await fs.mkdir(testUploadsDir, { recursive: true });
};