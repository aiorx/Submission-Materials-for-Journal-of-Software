// Using environment variables in a GraphQL context for authentication purposes
const server = new ApolloServer({
  context: ({ req }) => ({
    authKey: process.env.GRAPHQL_AUTH_KEY
  })
})

// Written with routine coding tools-4-0125-preview
