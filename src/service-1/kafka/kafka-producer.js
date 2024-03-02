// services/kafkaService.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
   clientId: 'my-app-1',
   brokers: ['localhost:9092'],
});

const producer = kafka.producer();

 async function sendMessageToKafka(message) {
   try {
      await producer.connect();
      await producer.send({
         topic: 'topic1',
         messages: [{ value: message }],
      });
      await producer.disconnect();
      console.log('Message sent to Kafka:', message);
   } catch (error) {
      console.error('Error sending message to Kafka:', error);
   }
}


module.exports = {sendMessageToKafka};