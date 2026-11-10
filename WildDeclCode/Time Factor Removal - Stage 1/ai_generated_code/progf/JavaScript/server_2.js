/*
NOTE: Ths was mostly Supported via standard programming aids since this was simply a
fun extra to add to my project!
*/

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var BskyAgent = require.BskyAgent;('@atproto/api');
require('dotenv').config();

var app = express();
var PORT = 3000;

// Your predefined messages
var messages = [
    "Luke is so lazy and dumb!",
    "Luke HATES being productive and is terrible too",
    "Luke is not good!"
];

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.post('/send-message', async function (req, res) {
    try {
        var agent = new BskyAgent({ service: 'https://bsky.social' });
        await agent.login({
            identifier: process.env.BLUESKY_HANDLE,
            password: process.env.BLUESKY_PASSWORD,
        });

        // Format timestamp and append random message
        var timestamp = new Date().toLocaleString();
        var randomMessage = messages[Math.floor(Math.random() * messages.length)];
        var message = "⏱️ " + (timestamp) + " — " + (randomMessage) + "";

        var result = await agent.post({
            text: message,
            createdAt: new Date().toISOString(),
        });

        res.json({ success: true, uri: result.uri });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, function () { return console.log("Server running on http://localhost:" + (PORT) + ""); });
