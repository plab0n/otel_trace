const express = require('express');
const { createMessage, getUsers } = require('./message-controller');

const kafkaRoute = express.Router();

kafkaRoute.post('/messages', createMessage);


kafkaRoute.get('/getAllUsers', getUsers);

module.exports = { kafkaRoute };
