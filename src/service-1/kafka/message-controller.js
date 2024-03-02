const { sendMessageToKafka } = require('./kafka-producer');
const axios = require('axios');
const { setupTracing } = require('../tracer');

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

const tracer = setupTracing('user-trace');

// Get all users from the service-2
async function getUsers(req, res) {
   const getSpan = tracer.startSpan('get-users-function');
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
   } finally {
      getSpan.end();
   }
}

module.exports = { createMessage, getUsers };
