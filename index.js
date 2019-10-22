#!/usr/bin/env node

process.env["NODE_CONFIG_DIR"] = process.cwd();
const config = require('config');
console.log(config);

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
  res.json(config);
});

// Start the server
const PORT = process.env.PORT || 8887;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
