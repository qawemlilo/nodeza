"use strict";

/*
 *  Application point of entry
**/
const config = require('./config');
const _ = require('lodash');
const path = require('path');
const app = require('widget-cms');
const helpers = require('./lib/helpers');
const middleware = require('./lib/middleware');
const widgetLoader = require('widget-loader');
const widgetsDir = path.join(process.cwd(), 'widgets');
const env = process.env.NODE_ENV || 'development';


app.config(_.defaults({

  port: config.site.port,

  secret: config.site.sessionSecret,

  db: config.db[env],

  cache: false,

  log: true,

  rootDir: process.cwd(),

  uploadsDir: path.join(process.cwd(), 'public', 'uploads'),

  middleware: {
    enableForms: true,
    enableCSRF: true,
    inputValidation: true,
    enableSessions: true
  },

  csrfWhitelist: [
    '/users/upload-image',
    '/blog/new',
    '/blog/edit'
  ]
}, config));


app.registerMiddleware(widgetLoader(app, {
  widgetDirectory: widgetsDir
}));

// return-to middleware
app.registerMiddleware(middleware.returnTo());

app.registerHelper(function (hbs) {
  helpers.setup(hbs);
});


app.start();
