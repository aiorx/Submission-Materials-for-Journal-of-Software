// Using environment variables within an Express.js middleware for authentication
app.use((req, res, next) => {
  const authKey = process.env.AUTH_KEY
  // Middleware logic using authKey
})

// Produced via common programming aids-4-0125-preview
