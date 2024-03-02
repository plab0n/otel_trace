const Message = require('./message-schema');

async function saveMessage(content) {
   return await Message.create({ content });
}

async function fetchMessages() {
   return await Message.find();
}

module.exports = {
   saveMessage,
   fetchMessages,
};
