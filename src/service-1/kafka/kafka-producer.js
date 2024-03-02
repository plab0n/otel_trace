const { Kafka } = require('kafkajs');
const { tracer } = require('../span.js');

const kafka = new Kafka({
   clientId: 'my-app-1',
   brokers: ['localhost:9092'],
});

// const tracer = setupTracing('main-trace');

const producer = kafka.producer();

async function sendMessageToKafka(message) {
   const postSpan = tracer.startSpan('kafka-producer');

   try {
      await producer.connect();

      await producer.send({
         topic: 'topic1',
         messages: [
            {
               value: message,
               // headers: {
               //    parentSpan: `${parentSpan}`,
               // },
            },
         ],
      });
      console.log('Message sent to Kafka:', message);
   } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error; // Propagate the error to the caller
   } finally {
      await producer.disconnect(); // Ensure disconnection even in case of error
      postSpan.end();
   }
}

module.exports = { sendMessageToKafka };
