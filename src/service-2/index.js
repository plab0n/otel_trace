const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { mongodConnectDB } = require('./mongodb/mongodb-config');
const { mongodbRoute } = require('./mongodb/mongo-route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// app.use('/api/v1', kafkaRoute);

app.get('/', (req, res) => {
   res.send('Hello World! I am a multiplier.');
});

require('./kafka/kafka-consumer');

app.use('/api/v1', mongodbRoute);

app.listen(PORT, () => {
   console.log(`Listening on http://localhost:${PORT}`);
   mongodConnectDB();
});

module.exports = app;
