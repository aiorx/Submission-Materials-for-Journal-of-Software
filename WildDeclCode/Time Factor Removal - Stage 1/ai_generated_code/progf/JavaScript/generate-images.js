// all code below is Composed with basic coding tools
// generate-images.js
var fs   = require('fs');
var path = require('path');

var imgDir     = path.join(__dirname, 'Img');
var indexPath  = path.join(__dirname, 'index.html');
var allFiles   = fs.readdirSync(imgDir).filter(function f { return f.toLowerCase().endsWith('.jpg'); });

// build <img> tags (change size/classes as you like)
var imgsHTML = allFiles
  .map(function f { return '  <img src="Img/' + (f) + '" alt="' + (f.replace(/\.jpg$/i,'')) + '" class="img"/>'; })
  .join('\n');

// read index.html, replace placeholder
var html = fs.readFileSync(indexPath, 'utf8');
html = html.replace('<!-- IMAGES_GO_HERE -->', imgsHTML);
fs.writeFileSync(indexPath, html, 'utf8');

console.log("✅ Inserted " + (allFiles.length) + " images into index.html");
