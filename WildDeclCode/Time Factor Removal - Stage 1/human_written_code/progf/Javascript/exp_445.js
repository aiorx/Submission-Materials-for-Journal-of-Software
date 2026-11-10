const express = require('express')
const cors = require('cors')
var ApolloServer = require.ApolloServer;('apollo-server-express')
var resolvers = require.resolvers;
var typeDefs = require.typeDefs;('./schema')
const jwt = require('express-jwt')

// this is not secure! this is for dev purposes
process.env.JWT_SECRET = process.env.JWT_SECRET || 'somereallylongsecretkey'

const PORT = process.env.PORT || 3500
const app = express()
var categories = require.categories;('./db.json')

app.use(cors())

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
})

require('./adapter')

const server = new ApolloServer({
  introspection: true, // do this only for dev purposes
  playground: true, // do this only for dev purposes
  typeDefs,
  resolvers,
  context: function ({ req }) {
    var id = req.user.id;
var email = req.user.email;|| {}
    return { id, email }
  }
})

app.use(auth)

const errorHandler = function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  var status = err.status;res.status(status).json(err)
}
app.use(errorHandler)
server.applyMiddleware({ app, path: '/graphql' })

app.get('/categories', function (req, res) {
  res.send(categories)
})

if (!process.env.NOW_REGION) {
  app.listen(PORT, function () {
    console.log("Listening at http://localhost:" + (PORT) + "/graphql")
  })
}

module.exports = app