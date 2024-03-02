const { saveMessage, fetchMessages } = require('./message-service');

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



module.exports = {
   createMessage,
   getMessages,
};
