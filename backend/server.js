const express = require('express');
const cors = require('cors');

const app = express();

const port = 8001;

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('The answer for hello!');
});

app.listen(port, () => {
  console.log('the server is running at: ', port);
});



