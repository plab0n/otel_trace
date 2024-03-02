const { client } = require('../redis/redis.config');
const { saveMessage, fetchMessages } = require('./message-service');
const axios = require('axios');

async function createMessage(content) {
   try {
      const message = await saveMessage(content);
      return message;
   } catch (error) {
      console.log('Error', { error: error.message });
   }
}

async function getMessages(req, res) {
   try {
      const messages = await fetchMessages();
      res.json(messages);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

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

async function cacheUsers() {
   try {
      const response = await axios.get(
         'https://jsonplaceholder.typicode.com/users',
      );
      const users = JSON.stringify(response.data); // Convert users data to JSON string
      await client.set('users', users); // Save users data to Redis
      console.log('Users data cached in Redis');
   } catch (error) {
      console.error('Error caching users in Redis:', error);
   }
}

async function getUsers(req, res) {
   try {
      const cachedUsers = await client.get('users');
      if (cachedUsers) {
         console.log('Users data found in Redis');
         res.json(JSON.parse(cachedUsers));
      } else {
         console.log('Users data not found in Redis, fetching from API');
         const response = await axios.get(
            'https://jsonplaceholder.typicode.com/users',
         );
         const users = response.data;
         // await client.set('users', 5000, JSON.stringify(users));
         await client.set('users', JSON.stringify(users), 'EX', 5);
         res.json(users);
      }
   } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
   getUsers,
   cacheUsers,
   deleteUser,
};
