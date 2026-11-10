// 
// A simple Node.js backend using Express Designed via basic programming aids.
//

var express = require('express');
var cors = require('cors');

var app = express();
var PORT = 3000;

app.use(cors());
app.use(express.json());

var messages = {
    '1234': 'Hello from the backend!',
};

app.get('/', function (req, res) {
    res.send('This is the backend!');
});

app.post('/api/greeting', function (req, res) {

    console.log("HTTP POST /api/greeting from the frontend.");

    var { message: newMessage } = req.body;
    var prevMessage = messages[req.query.id];
    messages[req.query.id] = newMessage;

    res.json({ 
        prevMessage: prevMessage,
        newMesssage: newMessage,
     });
});

app.get('/api/greeting', function (req, res) {

    console.log("HTTP GET /api/greeting from the frontend.");

    res.json({ message: messages[req.query.id] });
});

app.listen(PORT, function () {
    console.log("Server is running on http://localhost:" + (PORT) + "");
});