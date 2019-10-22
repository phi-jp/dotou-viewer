#!/usr/bin/env node

process.env["NODE_CONFIG_DIR"] = process.cwd();
const config = require('config');
console.log(config);