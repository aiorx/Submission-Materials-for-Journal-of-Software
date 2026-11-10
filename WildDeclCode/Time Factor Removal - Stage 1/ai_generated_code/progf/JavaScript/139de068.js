// Using environment variables within an Express.js middleware for authentication
app.use(function (req, res, next) {
  var authKey = process.env.AUTH_KEY
  // Middleware logic using authKey
})

// Produced via common programming aids-4-0125-preview
