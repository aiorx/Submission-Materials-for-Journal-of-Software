// Using environment variables in a Dockerized Node.js application for database credentials
var pg = require('pg')
var pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
})

// Produced via common programming aids-4-0125-preview
