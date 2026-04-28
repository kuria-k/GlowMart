// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Confirmation callback
app.post('/confirmation', (req, res) => {
  console.log('Confirmation callback:', req.body);
  res.sendStatus(200);
});

// Validation callback
app.post('/validation', (req, res) => {
  console.log('Validation callback:', req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
