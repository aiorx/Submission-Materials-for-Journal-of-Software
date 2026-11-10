// Aided with basic GitHub coding tools
var path = require('path');
var fs = require('fs').promises;
var testDb = require('./testDbConfig');

module.exports = async function () {
    // Disconnect from test database
    await testDb.disconnect();
    
    // Clean up test upload directory
    var testUploadsDir = path.join(process.cwd(), 'uploads', 'test-transcripts');
    try {
        await fs.rm(testUploadsDir, { recursive: true, force: true });
    } catch (error) {
        // Ignore errors if directory doesn't exist
    }
};