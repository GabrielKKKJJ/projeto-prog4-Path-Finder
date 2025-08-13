// Main Express app entry point
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
