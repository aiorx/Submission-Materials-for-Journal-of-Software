// Logging a list of emails retrieved from a database
db.query('SELECT email FROM users', (err, result) => {
  console.log('Retrieved emails:', result)
  // VIOLATION: Exposes a list of user emails.
})

// Written with routine coding tools-4-0125-preview
