const { Kafka } = require('kafkajs');
const { setupTracing } = require('../tracer.js');

const kafka = new Kafka({
   clientId: 'my-app-1',
   brokers: ['localhost:9092'],
});

const tracer = setupTracing('kafka-service');

const producer = kafka.producer();

async function sendMessageToKafka(message) {
   const parentSpan = tracer.startSpan('kafka-producer');
   console.log('🚀 ~ sendMessageToKafka ~ parentSpan:', parentSpan);
   try {
      await producer.connect();

      await producer.send({
         topic: 'topic1',
         messages: [
            {
               value: message,
               headers: {
                  parentSpan: `${parentSpan}`,
               },
            },
         ],
      });
      await producer.disconnect();
      console.log('Message sent to Kafka:', message);
   } catch (error) {
      console.error('Error sending message to Kafka:', error);
   } finally {
      parentSpan.end();
   }
}

module.exports = { sendMessageToKafka };
