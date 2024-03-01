require('dotenv').config();
const express = require('express');

const PORT = parseInt(process.env.PORT);
const app = express();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post('/add', (req, res) => {
  console.log(req)
  res.send()
  return
  let a = req.body['a']
  let b = req.body['b']
  let sum = a + b
  res.send({"sum": sum})      
});
app.listen(PORT, () => {
  console.log("Process ", process)
  console.log(`Listening for requests on http://localhost:${PORT}`);
});