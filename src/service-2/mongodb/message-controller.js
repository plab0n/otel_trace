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

async function getUsers(req, res) {
   try {
      const response = await axios.get(
         'https://jsonplaceholder.typicode.com/users',
      );
      const users = response.data;
      // setTimeout(() => {
      //    res.json(users);
      // }, 1000);
      res.json(users);
   } catch (error) {
      // Handle errors
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}


module.exports = {
   createMessage,
   getMessages,
   getUsers,
};
