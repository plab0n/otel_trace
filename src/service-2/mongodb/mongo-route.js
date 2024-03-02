const express = require('express');
const { getMessages } = require('./message-controller');

const mongodbRoute = express.Router();

mongodbRoute.get('/messages', getMessages);

module.exports = { mongodbRoute };
