const express = require('express');
const app = express();
const port = 3003;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Test server listening at http://localhost:${port}`);
}); 