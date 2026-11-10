require('reflect-metadata');
var createConnection = require('typeorm').createConnection;
var ApolloServer = require('apollo-server-express').ApolloServer;
var express = require('express');
var cookieParser = require('cookie-parser');

var typeDefs = require('./typeDefs').typeDefs;
var resolvers = require('./resolvers').resolvers;
var verify = require('jsonwebtoken').verify;
var ACCESS_TOKEN_SECRET = require('./constants').ACCESS_TOKEN_SECRET;

const startServer = async function () {
  const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res })
  });

  await createConnection();

  const app = express();

  app.use(cookieParser());

  app.use((req, _, next) => {
    const accessToken = req.cookies["access-token"];
    try {
      const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any;
      (req as any).userId = data.userId;
    } catch {}
    next();
  });

  server.applyMiddleware({ app }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log("🚀 Server ready at http://localhost:4000" + (server.graphqlPath) + "")
  );
};

startServer();
