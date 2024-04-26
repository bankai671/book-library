const mongoose = require('mongoose');

const { MONGO_URL } = require('./config.js');

const connectDB = () => {
    mongoose.connect(MONGO_URL)
      .then(() => console.log('Connected to MongoDB!'))
      .catch(error => console.error('Error connecting to MongoDB:', error));
};

module.exports = connectDB;

