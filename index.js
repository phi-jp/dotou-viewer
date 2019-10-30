#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const pug = require('pug');
const config = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/dotou.yaml`));
const express = require('express');
const app = express();

// setup express
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${process.cwd()}`));

// setup pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// setup routing
app.get('/', async (req, res) => {
  res.render('index', {
    config
  });
});

app.get('/config', async (req, res) => {
  res.json(config);
});

// pug のときは pug を html に変換して返す
if (config.type === 'pug') {
  app.get('/:section_id/:item_id', (req, res) => {
    var html = pug.renderFile(process.cwd() + `${req.url}.pug`, {
      pretty: true,
    });
    res.send(html);
  });
}

// Start the server
const PORT = process.env.PORT || 8887;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
