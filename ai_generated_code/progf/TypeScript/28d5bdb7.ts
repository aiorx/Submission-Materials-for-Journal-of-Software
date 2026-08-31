// Logging user's IP address during a request
app.get('/', (req, res) => {
  console.log('Received request from IP:', req.ip)
  // VIOLATION: Exposes user's IP address.
  res.send('Hello World')
})

// Produced via common programming aids-4-0125-preview
