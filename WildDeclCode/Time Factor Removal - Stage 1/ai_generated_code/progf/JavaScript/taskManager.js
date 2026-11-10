//--- partly Assisted with basic coding tools
var express = require('express')
var bodyParser = require('body-parser')
var swaggerUi = require('swagger-ui-express')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var OpenApiValidator = require('express-openapi-validator')
var fs = require('fs')
var yaml = require('yaml')

var app = express()
var port = 3000

app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: 'Ahhhhhhh',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
//---


//--- Assisted with basic coding tools
var apiSpecPath = './scripts/api-docs/openapi.yaml'
var apiSpec = yaml.parse(fs.readFileSync(apiSpecPath, 'utf8'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: true, 
    validateResponses: true
  })
);
//---

var USER = process.env.USER || 'zli'
var PASSWORD = process.env.PASSWORD || 'zli1234'

//--- Assisted with basic coding tools
var tasks = [
    {
        id: 1,
        title: "Complete the project",
        description: "Finish all remaining tasks for the project by the end of the month.",
        done: false,
        dueDate: "2024-06-30",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Prepare meeting notes",
        description: "Gather all necessary documents and prepare notes for the upcoming client meeting.",
        done: false,
        dueDate: "2024-06-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "Update software",
        description: "Update all office computers with the latest security patches and software updates.",
        done: true,
        dueDate: "2024-06-10",
        createdAt: new Date().toISOString()
    }
];
//---

app.get('/tasks', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    res.json(tasks)
});

app.post('/tasks', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    if (isTaskStructureCorrect(req, res)) {
        var title = req.body.title;
var description = req.body.description;
var done = req.body.done;
var dueDate = req.body.dueDate;var nextId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1

        var newTask = { id: nextId, title, description, done, dueDate, createdAt: new Date() }
        tasks.push(newTask);
        res.status(201).send("task " + (title) + " created")
    }
});

app.get('/tasks/:id', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    var task = tasks.find(t => t.id === parseInt(req.params.id))
    if (task) {
        res.json(task)
    } else {
        res.status(404).send('task not found')
    }
});

app.patch('/tasks/:id', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    var task = tasks.find(t => t.id === parseInt(req.params.id))
    if (!task) {
        return res.status(404).send('task not found')
    }

    //--- Assisted with basic coding tools
    var title = req.body.title;
var description = req.body.description;
var done = req.body.done;
var dueDate = req.body.dueDate;task.title = title || task.title
    task.description = description || task.description
    task.done = done !== undefined ? done : task.done
    task.dueDate = dueDate || task.dueDate
    res.json(task)
    //---
});

app.delete('/tasks/:id', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    var index = tasks.findIndex(t => t.id === parseInt(req.params.id))
    //--- Assisted with basic coding tools
    if (index === -1) {
        return res.status(404).send('task not found')
    }
    //---
    tasks.splice(index, 1)
    res.status(204).send()
});

app.post('/login', function (req, res) {
    var user = req.body.user;
var password = req.body.password;if (user === USER && password === PASSWORD) {
        req.session.user = user
        req.session.isAuthenticated = true
        res.status(200).send('logged in successfully')
    } else {
        res.status(401).send('login failed')
    }
})

app.get('/verify', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    res.send('user is authenticated')
})

app.delete('/logout', function (req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).send('user is not authenticated')
    }

    req.session.destroy()
    res.status(204).send()
});

//--- Assisted with basic coding tools
app.use(function (req, res) {
    res.status(404).send('endpoint not found')
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('something broke!')
});
//---

function isTaskStructureCorrect(req, res) {
    var title = req.body.title;
var description = req.body.description;
var done = req.body.done;
var dueDate = req.body.dueDate;if (!title || !description || done === undefined || !dueDate) {
        console.log("task structure not right: " + (req.body) + "")
        res.status(422).send('task structure not right')
        return false
    }
    return true
}

function isAuthenticated(req) {
    console.log("status of user authentivication: " + (req.session.isAuthenticated) + "")
    return req.session.isAuthenticated
}

app.listen(port, function () { return console.log("Listening on port " + (port) + ""); })