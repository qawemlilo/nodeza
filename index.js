
"use strict";

/*
 *  Application point of entry
**/
const config = require('./config');
const _ = require('lodash');
const path = require('path');
const app = require('widget-cms');


app.config(_.defaults({
  port: 3080, // default 3000

  secret: config.site.sessionSecret,

  db: {
    client: 'mysql', // pg
    connection: config.mysql,
    useNullAsDefault: true
  },

  cache: false,

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
