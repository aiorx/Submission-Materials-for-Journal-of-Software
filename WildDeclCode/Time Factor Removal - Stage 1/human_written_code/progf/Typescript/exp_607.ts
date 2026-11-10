require('dotenv/config');
var express = require('express');
var bodyParser = require('body-parser');
var runDb = require('./repositories/db').runDb;
var authRouter = require('./routes/auth/auth-router').authRouter;
var usersRouter = require('./routes/users/users-router').usersRouter;
var session = require('express-session');
var cookieParser = require('cookie-parser');

const app = express()

let usersOnline = 0

const daysToMS = function (daysCunt: number) {
    return daysCunt * 24 * 60 * 60 * 1000
}

const oneDay = daysToMS(1)
app.use(session({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())

const port = process.env.PORT || 5000

app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/login', function (req, res) {
    if (true) { // login true
        const refreshToken = 'refreshTokenValue.blsbsl.hash'
        res.cookie('refreshToken', refreshToken, {
            maxAge: daysToMS(1),
            httpOnly: true
        })
    }

    res.send('hello')
})

const startApp = async function () {
    await runDb()
    app.listen(port, () => {
        console.log("App started: " + (port) + "")
    })
}

startApp()
