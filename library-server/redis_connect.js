const { createClient } = require('redis');

const client = createClient();

client.connect();

client.on('connect', () => {
    console.log('Redis connected!');
});

client.on('error', (error) => {
    console.log('Redis connection failed: ', error);
})

module.exports = client;

