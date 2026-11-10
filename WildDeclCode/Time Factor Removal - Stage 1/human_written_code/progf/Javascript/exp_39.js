const config = require('config.json');
const mysql = require('mysql2/promise');
var Sequelize = require.Sequelize;('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    var host = config.database.host;
var port = config.database.port;
var user = config.database.user;
var password = config.database.password;
var database = config.database.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query("CREATE DATABASE IF NOT EXISTS \`" + (database) + "\`;");

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    // sync all models with database
    await sequelize.sync();
}