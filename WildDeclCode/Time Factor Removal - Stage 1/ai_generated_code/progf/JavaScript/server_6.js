// Supported via standard GitHub programming aids
var express = require('express');
var path = require('path');

var app = express();
var PORT = process.env.PORT || 3005;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve node_modules for Saffron components and Font Awesome
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, function () {
  console.log("Server running on port " + (PORT) + "");
});