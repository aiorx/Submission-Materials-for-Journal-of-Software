// Aided with basic GitHub coding tools
var mongoose = require('mongoose');
var logger = require('../utils/logger');

var connectDB = async function (uri) {
  try {
    // If uri is provided (testing environment), use it
    // Otherwise, use the environment variable
    var connectionString = uri || process.env.MONGO_URI;
    
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
    }
    
    await mongoose.connect(connectionString);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error("MongoDB connection error: " + (error.message) + "");
    // Only exit in production environment
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
