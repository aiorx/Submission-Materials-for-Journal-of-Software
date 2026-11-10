var express = require('express');
var join = require('path').join;
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var paginate = require('express-paginate');
var graphqlHTTP = require('express-graphql').graphqlHTTP;
var loadSchemaSync = require('@graphql-tools/load').loadSchemaSync;
var GraphQLFileLoader = require('@graphql-tools/graphql-file-loader').GraphQLFileLoader;
var addResolversToSchema = require('@graphql-tools/schema').addResolversToSchema;

var auth = require('./auth');
var userRoutes = require('./user-routes');
var contactRoutes = require('./contact-routes');
var bankAccountRoutes = require('./bankaccount-routes');
var transactionRoutes = require('./transaction-routes');
var likeRoutes = require('./like-routes');
var commentRoutes = require('./comment-routes');
var notificationRoutes = require('./notification-routes');
var bankTransferRoutes = require('./banktransfer-routes');
var testDataRoutes = require('./testdata-routes');
var checkAuth0Jwt = require('./helpers').checkAuth0Jwt;
var verifyOktaToken = require('./helpers').verifyOktaToken;
var checkCognitoJwt = require('./helpers').checkCognitoJwt;
var checkGoogleJwt = require('./helpers').checkGoogleJwt;
var resolvers = require('./graphql/resolvers');
var frontendPort = require('../src/utils/portUtils').frontendPort;
var backendPort = require('../src/utils/portUtils').backendPort;

require("dotenv").config();

const corsOption = {
  origin: "http://localhost:" + (frontendPort) + "",
  credentials: true,
};

const schema = loadSchemaSync(join(__dirname, "./graphql/schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const app = express();

/* istanbul ignore next */
// @ts-ignore
if (global.__coverage__) {
  require("@cypress/code-coverage/middleware/express")(app);
}

app.use(cors(corsOption));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(paginate.middleware(+process.env.PAGINATION_PAGE_SIZE!));

/* istanbul ignore next */
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
  app.use("/testData", testDataRoutes);
}

app.use(auth);

/* istanbul ignore if */
if (process.env.REACT_APP_AUTH0) {
  app.use(checkAuth0Jwt);
}

/* istanbul ignore if */
if (process.env.REACT_APP_OKTA) {
  app.use(verifyOktaToken);
}

/* istanbul ignore if */
if (process.env.REACT_APP_AWS_COGNITO) {
  app.use(checkCognitoJwt);
}

/* istanbul ignore if */
if (process.env.REACT_APP_GOOGLE) {
  app.use(checkGoogleJwt);
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaWithResolvers,
    graphiql: true,
  })
);

app.use("/users", userRoutes);
app.use("/contacts", contactRoutes);
app.use("/bankAccounts", bankAccountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/bankTransfers", bankTransferRoutes);

app.use(express.static(join(__dirname, "../public")));

app.listen(backendPort);
