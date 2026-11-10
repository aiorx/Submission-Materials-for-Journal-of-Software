var MongoClient = require.MongoClient;
var ObjectId = require.ObjectId;('mongodb');
var config = require.config;('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = "mongodb+srv://" + (USER) + ":" + (PASSWORD) + "@" + (config.dbHost) + ":" + (config.dbPort) + "/" + (DB_NAME) + "?retryWrites=true&w=majority";

class MongoConnect {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  };
  connect() {
    if (!MongoConnect.connection) {
      MongoConnect.connection = new Promise(function (resolve, reject) {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }
          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoConnect.connection;
  };

  getAll(collection, query) {
    return this.connect().then(function db {
      return db
        .collection(collection)
        .find(query)
        .toArray()
    });
  };

  get(collection, id) {
    return this.connect().then(function db {
      return db.collection(collection).findOne({ _id: ObjectId(id) })
    });
  };

  create(collection, data) {
    return this.connect()
      .then(function db { return db.collection(collection).insertOne(data); })
      .then(function result { return result.insertedId; })
  };

  update(collection, id, data) {
    return this.connect()
      .then(function db {
        return db.collection(collection).updateOne(
          { _id: ObjectId(id) },
          { $set: data },
          { upsert: true }
        )
      })
      .then(function result { return result.upsertedId || id; });
  };

  delete(collection, id) {
    return this.connect()
      .then(function db {
        return db
          .collection(collection)
          .deleteOne({ _id: ObjectId(id) })
      })
      .then(function () { return id; });
  }
}

module.exports = MongoConnect;
