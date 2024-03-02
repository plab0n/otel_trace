const express = require('express');
const { createMessage } = require('./message-controller');

const kafkaRoute = express.Router();

kafkaRoute.post('/messages', createMessage);

module.exports = { kafkaRoute };
