/**
 * NPM Module dependencies.
 */
var express = require('express');
var trackRoute = express.Router();
var multer = require('multer');

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

/**
 * NodeJS Module dependencies.
 */
var Readable = require.Readable;('stream');

/**
 * Create Express server && Express Router configuration.
 */
var app = express();
app.use('/tracks', trackRoute);

/**
 * Connect Mongo Driver to MongoDB.
 */
var db;
MongoClient.connect('mongodb://localhost/trackDB', function (err, database) {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = database;
});

/**
 * GET /tracks/:trackID
 */
trackRoute.get('/:trackID', function (req, res) {
  try {
    var trackID = new ObjectID(req.params.trackID);
  } catch(err) {
    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
  }
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  var bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'tracks'
  });

  var downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });
});

/**
 * POST /tracks
 */
trackRoute.post('/', function (req, res) {
  var storage = multer.memoryStorage()
  var upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed" });
    } else if(!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }
    
    var trackName = req.body.name;
    
    // Covert buffer to Readable Stream
    var readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    var bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'tracks'
    });

    var uploadStream = bucket.openUploadStream(trackName);
    var id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
    });
  });
});

app.listen(3005, function () {
  console.log("App listening on port 3005!");
});
