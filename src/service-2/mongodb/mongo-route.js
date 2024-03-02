const express = require('express');
const { getMessages, getUsers } = require('./message-controller');

const mongodbRoute = express.Router();

mongodbRoute.get('/messages', getMessages);

mongodbRoute.get('/all-users', getUsers);

module.exports = { mongodbRoute };
