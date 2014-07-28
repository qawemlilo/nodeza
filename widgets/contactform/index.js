
var config = require('./config.json');
var when = require('when');

module.exports = config;

config.exec = function (App, collections) {
  config.collection = false;
  
  return when(config);
};