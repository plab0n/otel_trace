const express = require('express');
const { getMessages, getUsers, deleteUser } = require('./message-controller');

const mongodbRoute = express.Router();

mongodbRoute.get('/messages', getMessages);

// mongodbRoute.get('/all-users', getUsers);

// mongodbRoute.get('/deleteUser', deleteUser);

module.exports = { mongodbRoute };
