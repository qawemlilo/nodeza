require("babel-register");

"use strict";

/*
 *  Application point of entry
**/
const config = require('./config');
const _ = require('lodash');
const path = require('path');
const app = require('widget-cms');


app.config(_.defaults({
  port: config.site.port, // default 3000

  secret: 'my_ninja_cat',

  db: {
    client: 'mysql', // pg
    connection: config.mysql,
    useNullAsDefault: true
  },

  cache: false,

  redis: {expire: 60 * 60 * 5}, // assumes localhost, port 6379

  log: true,

  rootDir: process.cwd(),

  uploadsDir: path.join(process.cwd(), 'public', 'uploads'),

  middleware: {
    enableForms: true,
    enableCSRF: false,
    inputValidation: true,
    enableSessions: true
  }
}, config));


app.start();
