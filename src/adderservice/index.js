require('dotenv').config();
const opentelemetry = require('@opentelemetry/api')
const express = require('express');

const PORT = parseInt(process.env.PORT);
const app = express();

app.post('/add', (req, res) => {
  const span = opentelemetry.trace.getActiveSpan();
  try {
    console.log(req);
    const {a ,b} = req.body;
    span.setAttributes({
      'app.add.a': a,
      'app.add.b': b
    })
    let sum = a + b
    res.send({"sum": sum}) 
    span.end(); 
  } catch (error) {
    console.log(error)
    span.recordException(error)
    span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR })
    res.send("Error")
  }    
});
app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});