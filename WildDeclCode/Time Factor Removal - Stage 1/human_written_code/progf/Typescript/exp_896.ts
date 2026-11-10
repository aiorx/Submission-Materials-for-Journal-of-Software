var ApolloServer = require('apollo-server-micro').ApolloServer;
var buildSchema = require('type-graphql').buildSchema;
var applyMiddleware = require('graphql-middleware').applyMiddleware;

var cors = require('micro-cors');

require('reflect-metadata');

var getConnection = require('@models/index');
var AdminConnector = require('@connectors/admin').AdminConnector;
var PartnerConnector = require('@connectors/partner').PartnerConnector;
var CourseConnector = require('@connectors/course').CourseConnector;
var CouponConnector = require('@connectors/coupon').CouponConnector;

var resolvers = require('@api/resolvers');
var meMiddleware = require('@api/middleware/global/me');
var sentryMiddleware = require('@api/middleware/global/sentry');

var firebaseAdmin = require('@services/firebase/admin');

if (process.env.FIREBASE_ADMIN_UID) {
  firebaseAdmin
    .auth()
    .getUser(process.env.FIREBASE_ADMIN_UID)
    .then(function user {
      if (process.env.FIREBASE_ADMIN_UID) {
        firebaseAdmin
          .auth()
          .setCustomUserClaims(process.env.FIREBASE_ADMIN_UID, {
            ...user.customClaims,
            admin: true,
          });
      }
    });
}

const withCors = cors({
  origin: '*',
});

const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function (req: ServerRequest, res: ServerResponse) {;
  const connection = await getConnection();

  const schema = await buildSchema({
    resolvers,
    dateScalarMode: 'isoDate',
  });

  const server = new ApolloServer({
    schema: applyMiddleware(schema, sentryMiddleware, meMiddleware),

    context: async ({ req, res }): Promise<ResolverContext> => {
      const adminConnector = new AdminConnector();
      const partnerConnector = new PartnerConnector(connection!);
      const courseConnector = new CourseConnector(connection!);
      const couponConnector = new CouponConnector(connection!);

      return {
        req,
        res,
        adminConnector,
        courseConnector,
        partnerConnector,
        couponConnector,
      };
    },
  });

  const handler = withCors(
    server.createHandler({ path: '/api/graphql' })
  );

  return handler(req, res);
};
