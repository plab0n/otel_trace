const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { kafkaRoute } = require('./kafka/message-router');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

app.use('/api/v1', kafkaRoute);

app.get('/', (req, res) => {
   res.send('Hello World! I am a multiplier service.');
});

app.listen(PORT, () => {
   console.log(`Listening on http://localhost:${PORT}`);
});

module.exports = app;
