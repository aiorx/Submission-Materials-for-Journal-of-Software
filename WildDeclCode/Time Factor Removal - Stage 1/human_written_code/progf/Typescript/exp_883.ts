
// import * as bodyParser from "body-parser";
var cors = require('cors');
var express = require('express');
var resolve = require('path').resolve;
var initSwaggerMiddlware = require('./middlewares/swagger').initSwaggerMiddlware;
var env = require('./env');
var inOutLogger = require('./log').inOutLogger;
var monit = require('./monitoring');
var cls = require('./lib/cls');
var getCorsOptions = require('./cors').getCorsOptions;

env.checkEnv();
const app = express();
module.exports = app;
monit.init(app);
app.use(cors(getCorsOptions()));
app.use(cls.setRequestId);
app.use(inOutLogger);

initSwaggerMiddlware(app, resolve(__dirname), function () {
  // self.express.use('/api/weather', helloRouteBuilder);
  // self.express.use(bodyParser.json());
  // self.express.use(bodyParser.urlencoded({ extended: false }));
  // Custom error handler that returns JSON
  app.use(function (err, req: express.Request, res: express.Response, next) {
    if (err) {
      const errStr = err.message || err.toString();
      const errMsg = { message: errStr, extra: err };
      if (res.statusCode < 400) {
        res.status(500);
      }
      res.json(errMsg);
      console.log("test");
    }
  });

});
