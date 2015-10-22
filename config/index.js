"use strict";

var Config = {};
var env = process.env.NODE_ENV || 'development';


switch (env) {
  case 'production':
    Config = require('./env/production');
  break;

  case 'development':
    Config = require('./env/development');
  break;

  case 'testing':
    Config = require('./env/testing');
  break;

  case 'staging':
    Config = require('./env/staging');
  break;

}

Config.events  = require('./events');
Config.meetups = require('./meetups');
Config.site    = require('./site');
Config.blog    = require('./blog');

module.exports = Config;
