
"use strict";

/*
 *  Application point of entry
**/
const config = require('./config');
const _ = require('lodash');
const app = require('widget-cms');


app.config(_.extend({
  port: 3000, // default 3000

  secret: 'my_ninja_cat',

  db: {
    client: 'mysql', // pg
    connection: config.mysql
  },

  cache: true,

  redis: {expire: 60 * 5}, // assumes localhost, port 6379

  log: true,

  rootDir: process.cwd(),

  middleware: {
    enableForms: true,
    enableCSRF: true,
    inputValidation: true,
    enableSessions: true
  }
}, config));



app.start();
