var express = require('express');
var bodyParser = require('body-parser');
var graphqlExpress = require('apollo-server-express').graphqlExpress;
var graphiqlExpress = require('apollo-server-express').graphiqlExpress;
var makeRemoteExecutableSchema = require('graphql-tools').makeRemoteExecutableSchema;
var mergeSchemas = require('graphql-tools').mergeSchemas;
var introspectSchema = require('graphql-tools').introspectSchema;
var createApolloFetch = require('apollo-fetch').createApolloFetch;

async function run() {
	const createRemoteSchema = async function (uri: string) {
		const fetcher = createApolloFetch({uri});
		return makeRemoteExecutableSchema({
			schema: await introspectSchema(fetcher),
			fetcher
		});
	}
	const universeSchema = await createRemoteSchema('https://www.universe.com/graphql/beta')
	const weatherSchema = await createRemoteSchema('https://5rrx10z19.lp.gql.zone/graphql');
	const linkSchemaDefs = "
		extend type Location {
			weather: Weather
		}
		
    extend type Event {
        location: Location
		}
  "
	const schema = mergeSchemas({
		schemas: [universeSchema, weatherSchema, linkSchemaDefs],
		resolvers: function mergeInfo { return ({
			Event: {
				location: {
					fragment: "fragment EventFragment on Event {cityName}",
					resolve(parent: any, args: any, context: any, info: any) {
						const place: string = parent.cityName
						return mergeInfo.delegate(
							'query',
							'location',
							{place},
							context,
							info
						)
					}
				}
			}
		}); }})

	const app = express();

	app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

	app.use(
		'/graphiql',
		graphiqlExpress({
			endpointURL: '/graphql',
			query: 'query {
  event(id: "5983706debf3140039d1e8b4") {
    title
    description
    url
    location {
      city
      country
      weather {
        summary
        temperature
      }
    }
  }
}
      ',
		})
	);

	app.listen(3000);
	console.log('Server running. Open http://localhost:3000/graphiql to run queries.');
}

try {
	run();
} catch (e) {
	console.log(e, e.message, e.stack);
}
