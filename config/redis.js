let redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = { redisClient };