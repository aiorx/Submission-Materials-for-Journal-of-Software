// script Penned via basic programming aids as I am too lazy to do grunt work

var mongoose = require('mongoose');
var dotenv = require('dotenv');
var connectMongo = require('../../config/db.js');

dotenv.config();

var deleteAllCollections = async function () {
  try {

    await connectMongo();

    // Get all collections in the database
    var collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Drop each collection
    for (var collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log("Dropped collection: " + (collection.name) + "");
    }

    console.log("All collections have been dropped.");
  } catch (error) {
    console.error("Error while dropping collections:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the function
deleteAllCollections();
