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

// pug のときは pug を html に変換して返す
app.get('/:section_id/:item_id', (req, res) => {
  res.setHeader('content-type', 'text/html');
  
  if (config.type === 'pug') {
    var filename = `${process.cwd()}${req.url}.pug`;
    if (fs.existsSync(filename)) {
      var html = pug.renderFile(filename, {
        pretty: true,
      });
      res.send(html);
    }
    else {
      res.send('File not found');
    }
  }
  else if (config.type === 'riot') {
    res.render('riot-template', {
      params: {
        filename: `${req.url}.pug`,
      },
      pretty: true,
    });
  }
  else {
    var filename = `${process.cwd()}${req.url}.html`;
    if (fs.existsSync(filename)) {
      var html = fs.readFileSync(filename);
      res.send(html);
    }
    else {
      res.send('File not found');
    }
  }
});

// Start the server
const PORT = process.env.PORT || 8887;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
