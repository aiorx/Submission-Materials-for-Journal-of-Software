// Supported via standard GitHub programming aids
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  try {
    // Open an in-memory SQLite database
    const db = await open({
      filename: ':memory:',
      driver: sqlite3.Database,
    });

    // Apply the schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet TEXT NOT NULL CHECK(LENGTH(wallet) = 42),
        gpu TEXT NOT NULL CHECK(gpu <> ''),
        score REAL NOT NULL CHECK(score >= 0),
        fingerprint TEXT,
        timestamp INTEGER NOT NULL DEFAULT (STRFTIME('%s','now'))
      );

      CREATE INDEX idx_leaderboard_performance
      ON leaderboard (score DESC, timestamp DESC);

      CREATE TRIGGER validate_wallet_address
      BEFORE INSERT ON leaderboard
      FOR EACH ROW
      WHEN LENGTH(NEW.wallet) <> 42
      BEGIN
        SELECT RAISE(FAIL, 'Invalid wallet address length');
      END;

      CREATE TRIGGER update_leaderboard_timestamp
      AFTER UPDATE ON leaderboard
      FOR EACH ROW
      BEGIN
        UPDATE leaderboard SET timestamp = STRFTIME('%s','now') WHERE id = NEW.id;
      END;
    `);

    console.log('Schema applied successfully.');

    // Insert valid data
    await db.run(`INSERT INTO leaderboard (wallet, gpu, score) VALUES ('0x1234567890abcdef1234567890abcdef12345678', 'NVIDIA RTX 3080', 95.5)`);
    console.log('Valid data inserted successfully.');

    // Attempt to insert invalid data
    try {
      await db.run(`INSERT INTO leaderboard (wallet, gpu, score) VALUES ('invalid_wallet', 'NVIDIA RTX 3080', 95.5)`);
    } catch (error) {
      console.error('Error inserting invalid data:', error.message);
    }

    // Update a row to test the timestamp trigger
    await db.run(`UPDATE leaderboard SET score = 96.0 WHERE id = 1`);
    const updatedRow = await db.get(`SELECT * FROM leaderboard WHERE id = 1`);
    console.log('Updated row:', updatedRow);

    // Close the database
    await db.close();
    console.log('Database closed.');
  } catch (error) {
    console.error('Error during schema testing:', error);
  }
})();