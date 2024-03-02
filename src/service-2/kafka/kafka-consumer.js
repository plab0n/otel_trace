const { Kafka } = require('kafkajs');
const { createMessage } = require('../mongodb/message-controller');

const kafka = new Kafka({
   clientId: 'my-app-1',
   brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

async function consumeMessages() {
   await consumer.connect();
   await consumer.subscribe({ topic: 'topic1', fromBeginning: true });

   await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
         try {
            const messageContent = message.value.toString();
            console.log('Received message from Kafka:', messageContent);
            // Save the message to MongoDB
            await createMessage(messageContent);
            // Save the message to Redis

            console.log('Message saved to MongoDB:', messageContent);
         } catch (error) {
            console.error('Error consuming or saving message:', error);
         }
      },
   });
}

consumeMessages().catch(console.error);
