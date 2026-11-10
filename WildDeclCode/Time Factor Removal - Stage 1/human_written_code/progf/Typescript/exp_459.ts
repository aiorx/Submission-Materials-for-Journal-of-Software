require('reflect-metadata');
require('ts-tiny-invariant');
var ApolloServer = require('apollo-server-micro').ApolloServer;
var buildSchema = require('type-graphql').buildSchema;
var resolvers = require('prisma/generated/type-graphql').resolvers;
var PrismaClient = require('@prisma/client').PrismaClient;
var prisma = require('config/prisma');
var Cors = require('micro-cors');

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS', 'GET', 'HEAD'],
});

interface Context {
  prisma: PrismaClient;
}

const config = {
  api: {
    bodyParser: false,
  },
};

const functionHandler = async function (req, res) {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  const apolloServer = new ApolloServer({
    context: (): Context => ({ prisma }),
    schema,
    introspection: true,
  });
  const startServer = apolloServer.start();
  await startServer;
  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

module.exports = cors(function (req, res) {;
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  return functionHandler(req, res);
});
