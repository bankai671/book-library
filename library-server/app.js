const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./mongo_connect.js');
const createStaticDirs = require('./src/utils/createStaticDirs.js');

const router = require('./src/routes/router.js');

const { SERVER_PORT } = require('./config.js');

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.static('public'));

connectDB();
createStaticDirs();

app.use('/api', router);

app.listen(SERVER_PORT, () => {
    console.log("Server is running on port: ", SERVER_PORT);
});

