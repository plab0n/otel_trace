const express = require('express');
const { createMessage, getMessages } = require('./message-controller');

const kafkaRoute = express.Router();

kafkaRoute.post('/messages', createMessage);

kafkaRoute.get('/getMessages', getMessages);

module.exports = { kafkaRoute };
