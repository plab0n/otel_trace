const { client } = require('../redis/redis.config');
const { setupTracing } = require('../tracer');
const { saveMessage, fetchMessages } = require('./message-service');

async function createMessage(content) {
   try {
      const message = await saveMessage(content);
      return message;
   } catch (error) {
      console.log('Error', { error: error.message });
   }
}

const tracer = setupTracing('service-2-trace');

async function getMessages(req, res) {
   
   const messageSpan = tracer.startSpan('get-messages');

   try {
      const cachedMessage = await client.get('message');
      if (cachedMessage) {
         console.log('Message data found in Redis, fetching from cache');
         res.json(JSON.parse(cachedMessage));
      } else {
         console.log('message data not found in Redis, fetching from API');

         const messageALL = await fetchMessages();

         await client.set('message', JSON.stringify(messageALL), 'EX', 5);
         res.json(messageALL);
      }
   } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   } finally {
      messageSpan.end();
   }
}

async function deleteUser(req, res) {
   try {
      // Delete users data from Redis
      await client.del('users');
      console.log('Cached users data deleted from Redis');
      res.status(200).json({
         message: 'Cached users data deleted successfully',
      });
   } catch (error) {
      console.error('Error deleting cached users data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

module.exports = {
   createMessage,
   getMessages,
   deleteUser,
};

// async function getMessages(req, res) {
//    try {
//       const messages = await fetchMessages();
//       res.json(messages);
//    } catch (error) {
//       res.status(500).json({ error: error.message });
//    }
// }

// async function getUsers(req, res) {
//    try {
//       const response = await axios.get(
//          'https://jsonplaceholder.typicode.com/users',
//       );
//       const users = response.data;
//       // setTimeout(() => {
//       //    res.json(users);
//       // }, 1000);
//       res.json(users);
//    } catch (error) {
//       // Handle errors
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//    }
// }

// async function cacheUsers() {
//    try {
//       const response = await axios.get(
//          'https://jsonplaceholder.typicode.com/users',
//       );
//       const users = JSON.stringify(response.data); // Convert users data to JSON string
//       await client.set('users', users); // Save users data to Redis
//       console.log('Users data cached in Redis');
//    } catch (error) {
//       console.error('Error caching users in Redis:', error);
//    }
// }
