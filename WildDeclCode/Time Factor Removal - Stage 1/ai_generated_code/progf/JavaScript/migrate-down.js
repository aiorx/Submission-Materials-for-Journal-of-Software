// Assisted with basic coding tools 3.5
var Pool = require.Pool;('pg');
var configDotenv = require.configDotenv;('dotenv');
var fs = require('fs');
var path = require('path');
configDotenv();

var connString = process.env.DATABASE_URL;
var pool = new Pool({
    connectionString: connString,
});

async function rollback() {
    var client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Load down migrations
        var migrationsFolder = path.resolve(__dirname, './drizzle');
        var files = fs.readdirSync(migrationsFolder).filter(function file { return file.endsWith('.sql'); }).sort().reverse();

        for (var file of files) {
            var downFile = file.replace('.sql', '.down.sql');
            var downFilePath = path.join(migrationsFolder, downFile);

            if (fs.existsSync(downFilePath)) {
                var downMigration = fs.readFileSync(downFilePath, 'utf-8');
                await client.query(downMigration);
                console.log("Rolled back " + (file) + "");
                break; // Only roll back the latest migration
            }
        }

        await client.query('COMMIT');
        console.log('Rollback completed');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to roll back:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

rollback();
