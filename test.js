/**
 *  Database connection.
 */

var path = require('path');
var secrets = require('./config/secrets');
var hbsHelpers = require('./helpers');
var widget = require('widget-cms');

var server = widget.Server({
  host: secrets.host,
  user: secrets.user,
  password: secrets.password,
  database: secrets.db,
  charset: secrets.charset,
  staticFiles: path.join(__dirname,'views'),
  mongodb: secrets.mongodb
});

var hbs = server.handlebars();

hbs.localsAsTemplateData(server.express());
hbs.registerPartials(path.join(__dirname,'views', 'widgets'));
hbs.registerPartials(path.join(__dirname,'views', 'partials'));
hbs.registerPartials(path.join(__dirname,'views', 'account'));
hbs.registerPartials(path.join(__dirname,'views', 'events'));
hbs.registerPartials(path.join(__dirname,'views', 'meetups'));
hbs.registerPartials(path.join(__dirname,'views', 'posts'));

// setup and register handlebars helpers
hbsHelpers.setup(hbs);

server.start();
