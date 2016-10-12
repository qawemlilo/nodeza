"use strict";

/*
 *  Application point of entry
**/
const config = require('./config');
const _ = require('lodash');
const path = require('path');
const app = require('widget-cms');
const helpers = require('./lib/helpers');


app.config(_.defaults({

  port: config.site.port,

  secret: config.site.sessionSecret,

  db: config.db,

  cache: false,

  redis: {expire: 60 * 60 * 5},

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

app.registerMiddleware(function (req, res, next) {
  // don't cache if user is logged in
  if (req.isAuthenticated()) {
    res.use_express_redis_cache = false;
  }

  if (req.flash) {
    app.clearCache();
  }

  next();
});

app.registerHelper(function (hbs) {
  helpers.setup(hbs);
});


app.start();
