require('dotenv').config();

module.exports = {
    SERVER_PORT: process.env.PORT || 3001,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_TIME: process.env.JWT_ACCESS_TIME,
    JWT_REFRESH_TIME: process.env.JWT_REFRESH_TIME,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    MONGO_URL:  process.env.MONGO_URL,
};

