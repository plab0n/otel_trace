const { sendMessageToKafka } = require('./kafka-producer');
const axios = require('axios');


async function createMessage(req, res) {
   const { content } = req.body;
   try {
      // Save to Kafka
      await sendMessageToKafka(content);
      res.json({ message: 'Message sent to Kafka', content });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

async function getUsers(req, res) {
   try {
      const response = await axios.get(
         'http://localhost:2000/api/v1/all-users',
      );
      const allUsers = response.data;
      res.json(allUsers);
   } catch (error) {
      // Handle errors
      console.error('Error fetching all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

module.exports = { createMessage, getUsers };
