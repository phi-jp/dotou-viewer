#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const pug = require('pug');
const config = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/dotou.yaml`));
const express = require('express');
const app = express();

// setup config
config.contents = config.contents.map(content => {
  console.log(content);
  content.config = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/${content.file}`));
  return content;
});


// setup express
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
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

app.get('/:content', async (req, res) => {
  var content_config = config.contents.find(item => item.id === req.params.content);
  res.render('contents', {
    config: content_config,
  });
});

var writeFile = (filename, text) => {
  const DIR_NAME = path.dirname(filename);
  if (DIR_NAME.length > 1 && !fs.existsSync(DIR_NAME)) {
    fs.mkdirSync(DIR_NAME, { recursive: true });
  }
  fs.writeFileSync(filename, text);
};

// pug のときは pug を html に変換して返す
app.get('/:content/:section_id/:item_id([^.]+)', (req, res) => {
  var content_config = config.contents.find(item => item.id === req.params.content);

  res.setHeader('content-type', 'text/html');
  
  if (config.type === 'pug') {
    var filename = `${process.cwd()}${req.url}.pug`;
    if (!fs.existsSync(filename)) {
      writeFile(filename, `html\n  body\n    h1 Hello, dotou!`);
    }
    var html = pug.renderFile(filename, {
      pretty: true,
    });
    res.send(html);
  }
  else if (config.type === 'riot') {
    var filename = `${process.cwd()}${req.url}.pug`;

    console.log(filename);

    if (!fs.existsSync(filename)) {
      writeFile(filename, `app\n  h1 Hello, dotou!`);
    }
    res.render('riot-template', {
      params: {
        filename: `${req.url}.pug`,
      },
      pretty: true,
    });
  }
  else {
    var filename = `${process.cwd()}${req.url}.html`;
    if (!fs.existsSync(filename)) {
      writeFile(filename, `<h1>Hello, dotou!</h1>`);
    }
    var html = fs.readFileSync(filename);

    // console wrapper を追加
    html = '<script src="/console.js"></script>' + html;
    
    res.send(html);
  }
});

// Start the server
const PORT = process.env.PORT || 8887;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Access to http://localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
