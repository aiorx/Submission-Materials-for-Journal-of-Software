var express = require('express');

var dotenv = require('dotenv');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var logger = require('morgan');
var mongo = require('connect-mongo');
var path = require('path');
var flash = require('connect-flash');
var compression = require('compression');
var cors = require('cors');
var helmet = require('helmet');
var errorHandler = require('errorhandler');

dotenv.config({path: "variable.env"});
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
require('./handlers/passport');

// import environmental variables from our variables.env file

const MongoStore = mongo(session);
// Create Express server
const app = express();

app.use(helmet());
// view engine setup
app.set("views", path.join(__dirname, "../views")); // this is the folder where we keep our pug files
app.set("view engine", "pug"); // we use the engine pug, mustache or EJS work great too
app.get("env") === "development" ? app.use(require("express-status-monitor")()) : "";
app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, "../public")));

// Takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    }),
);

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

//  Express Routing URLS
app.use("/", indexRouter);
app.use("/auth", authRouter);

app.get("*", function(req: express.Request, res: express.Response) {
    return res.status(404).redirect("/404");
});

if (app.get("env") === "development") {
    app.use(errorHandler());
    app.locals.pretty = true;
}

module.exports = app;
