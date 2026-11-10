// This was Assisted with basic coding tools

var http = require('http');
var fs = require('fs');
var path = require('path');

var port = 3000; // Change this to any desired port number

var server = http.createServer(function (req, res) {
    // Check the requested URL and serve the appropriate file
    if (req.url === '/') {
        // Serve the HTML file
        var htmlFilePath = path.join(__dirname, 'match.html');
        fs.readFile(htmlFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url.startsWith('/images/')) {
        // Serve images
        var imagePath = path.join(__dirname, req.url);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Change the content type according to your image format
                res.end(data);
            }
        });
    } else {
        // Handle other requests
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

server.listen(port, function () {
    console.log("Server is running at http://localhost:" + (port) + "/");
});
