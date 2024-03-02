const Redis = require('ioredis');

const client = new Redis({
   host: 'localhost', // Redis server host
   port: 6379, // Redis server port
   // Add more options if needed
});


client.on('error', (error) => {
   console.error('Redis error:', error);
});

module.exports = { client };
