var express = require('express');
require('express-async-errors');

var json = require('body-parser').json;
var mongoose = require('mongoose');

var currentUserRouter = require('./routes/current-user').currentUserRouter;
var signinRouter = require('./routes/signin').signinRouter;
var signoutRouter = require('./routes/signout').signoutRouter;
var signupRouter = require('./routes/signup').signupRouter;
var errorHandler = require('./middlewares/error-handler').errorHandler;
var NotFoundError = require('./errors/not-found-error').NotFoundError;

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async function (req, res) {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async function () {
  try {
    await mongoose.connect('mongodb://auth-mongo-svc:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

start();
