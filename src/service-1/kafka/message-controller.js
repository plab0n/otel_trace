const { sendMessageToKafka } = require('./kafka-producer');

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

module.exports = {createMessage}