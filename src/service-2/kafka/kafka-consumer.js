const { Kafka } = require('kafkajs');
const { createMessage } = require('../mongodb/message-controller');
const opentelemetry = require('@opentelemetry/api');
const { setupTracing } = require('../tracer');

const kafka = new Kafka({
   clientId: 'my-app-1',
   brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const tracer = setupTracing('kafka-service');

async function consumeMessages() {
   await consumer.connect();
   await consumer.subscribe({ topic: 'topic1', fromBeginning: true });

   await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
         try {
            const messageContent = message.value.toString();

            // console.log({
            //    key: message.key ? message.key.toString() : null,
            //    value: messageContent,
            //    headers: {
            //       parentSpan: message.headers
            //          ? message.headers.parentSpan.toString()
            //          : null,
            //    },
            // });

            const parent = message.headers
               ? message.headers.parentSpan.toString()
               : null;

            const ctx = opentelemetry.trace.setSpan(
               opentelemetry.context.active(),
               parent,
            );

            // Start a new span
            const dbSpan = tracer.startSpan('db-operation', undefined, ctx);


            console.log('Received message from Kafka:', messageContent);
            // Save the message to MongoDB
            await createMessage(messageContent);
            // Save the message to Redis
            // dbSpan.end();
            console.log('Message saved to MongoDB:', messageContent);
         } catch (error) {
            console.error('Error consuming or saving message:', error);
         }
      },
   });
}

consumeMessages().catch(console.error);
