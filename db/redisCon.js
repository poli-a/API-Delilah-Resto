const redis = require('redis');

const clienteRedis = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT
});

clienteRedis.on('error', function(error) {
    console.error(error);
});

module.exports = clienteRedis;