const  { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'error',
    socket: {
        host: 'redis-14881.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14881,
        connectTimeout: 10000,
    }
});

client.on('error', err => console.log('Redis Client Error', err));
module.exports = client;