// Using environment variables in a GraphQL context for authentication purposes
var server = new ApolloServer({
  context: function ({ req }) { return ({
    authKey: process.env.GRAPHQL_AUTH_KEY
  }); }})

// Written with routine coding tools-4-0125-preview
