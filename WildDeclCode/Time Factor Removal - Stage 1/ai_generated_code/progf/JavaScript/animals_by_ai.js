// this code was Aided using common development resources 4

var express = require('express');
var MongoClient = require.MongoClient;('mongodb');
var path = require('path');
var app = express();
var port = 5000;

app.use(express.json());

var uri = "mongodb://localhost:27017";
var client = new MongoClient(uri);
var dbName = "animalDB";
var collectionName = "animals";

// Function to setup the animals collection and data in MongoDB
async function setupAnimalData() {
    try {
        await client.connect();
        var db = client.db(dbName);
        var collection = db.collection(collectionName);

        // Check if the collection is empty and initialize data if it is
        var count = await collection.countDocuments();
        if (count === 0) {
            await collection.insertMany([
                { animalName: 'lion', imgName: 'lion.png' },
                { animalName: 'rabbit', imgName: 'rabbit.png' },
                { animalName: 'turtle', imgName: 'turtle.png' }
            ]);
            console.log('Animal data initialized.');
        } else {
            console.log('Animal data already exists.');
        }
    } finally {
        await client.close();
    }
}

// GET request handler to fetch animals from MongoDB
app.get('/api/animals', async function (req, res) {
    try {
        await client.connect();
        var db = client.db(dbName);
        var collection = db.collection(collectionName);
        var animals = await collection.find({}).toArray();
        res.json(animals);
    } catch (err) {
        res.status(500).send('Error fetching animal data');
    } finally {
        await client.close();
    }
});

// POST request handler
app.post('/api/image', function (req, res) {
    var color = req.body.color;
var imgName = req.body.imgName;
    var imagePath = path.join('public', color, imgName);
    res.sendFile(path.resolve(imagePath), err => {
        if (err) {
            res.status(404).send('Image not found');
        }
    });
});

app.listen(port, function () {
    console.log("Server running at http://localhost:" + (port) + "");
});

// Uncomment the line below to initialize the animal data in MongoDB
// setupAnimalData().catch(console.dir);
