//import express from "express";

// Written with routine coding tools-3.5, when asked to fix the following error:
// Property 'user' does not exist on type 'Session & Partial<SessionData>'.
import express, { Request, Response } from "express";
import session, { Session, SessionData } from "express-session";
interface CustomSession extends Session {
    user?: { id: number; username: string; password: string };
}


const app = express();
const port = 3000;

//const session = require("express-session");
//const passport = require("passport")
const parser = require("body-parser")
//const LocalStrategy = require("passport-local").Strategy

var bcrypt = require("bcryptjs");


interface User {
    id: number;
    username: string;
    password: string;
}

interface Todolist {
    id: number;
    todos: string[];
}

let users: User[] = [];
let todos: Todolist[] = [];

//function initAuth(passport) {
//    function authUser(username, password, done) {
//        const user = users.find((user) => { user.username === username })
//        if (!user) {
//            console.log("User not found");
//            return done(null, false);
//        }
//        
//        if (bcrypt.compareSync(password, user.password)) {
//            console.log("user: " + user.username + " logged in!");
//            return done(null, user);
//        } else {
//            console.log("Password incorrect");
//            return done(null, false);
//        }
//    }
//    
//    passport.use(new LocalStrategy(authenticateUser));
//    passport.serializeUser((user, done) => done(null, user.id));
//    passport.deserializeUser((id, done) => {
//        return done(null, users.find((user) => { user.id === id }));
//    })
//}

//function checkAuth(res, req, next) {
//    return (res.isAuthenticated()) ? res.redirect("/") : next();
//}
//
//initAuth(passport);

app.use(express.json());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(session({
    secret: "761397281d629389589548a97a112d058250cfe13624dcb2aa9827036f0ff065",
    resave: false,
    saveUninitialized: false
}));

//app.use(passport.initialize());
//app.use(passport.session());

app.post("/api/user/register", (req: Request & { session: CustomSession }, res: Response) => {
    if (req.session.user) {
        res.redirect("/");
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    const userexists = users.find(u => u.username === username);

    if (userexists) {
        res.status(400).send("User exists.");
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const idlen = 5;

    let id = Math.floor(Math.random() * 10);

    for (let i = 0; i < idlen; i++)
    {
        id *= 10;
        id += Math.floor(Math.random() * 10);
    }

    const user: User = { id: id, username: username, password: hash };
    users.push(user as User);

    res.send(user);
});

app.post("/api/user/login", (req: Request & { session: CustomSession }, res: Response) => {
    if (req.session.user) {
        res.redirect("/");
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).send("Logged in");
    } else {
        res.status(401).send("Invalid credentials");
    }
});

app.get("/api/user/list", (req: Request & { session: CustomSession }, res: Response) => {
    res.status(200).send(users);
});

app.get("/api/secret", (req: Request & { session: CustomSession }, res: Response) => {
    if (!req.session.user) {
        res.status(401).send("Unauthorized");
        return;
    }
        
    res.status(200).send("Authorized");
});

app.post("/api/todos", (req: Request & { session: CustomSession }, res: Response) => {
    if (!req.session.user) {
        res.status(401).send("Unauthorized");
        return;
    }

    const foundlist = todos.find(t => t.id === req.session.user.id);
    const todotext = req.body.todo;

    if (!foundlist) {
        const newtodo: Todolist = {
            id: req.session.user.id,
            todos: [todotext],
        };

        todos.push(newtodo);
    } else {
        foundlist.todos.push(todotext);
    }

    res.status(200).send(todos.find(t => t.id === req.session.user.id));
});

app.get("/api/todos/list", (req: Request & { session: CustomSession }, res: Response) => {
    if (!req.session.user) {
        res.status(401).send("Unauthorized");
        return;
    }

    res.send(todos);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
