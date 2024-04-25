const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./src/routes/router.js');

const { SERVER_PORT } = require('./config.js');
const { MONGO_URL } = require('./src/config/db.js');


const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

function connectDB() {
    mongoose.connect(MONGO_URL)
      .then(() => console.log('Connected to MongoDB!'))
      .catch(error => console.error('Error connecting to MongoDB:', error));
}

connectDB();

app.use('/api', router);

app.listen(SERVER_PORT, () => {
    console.log("Server is running on port: ", SERVER_PORT);
});

