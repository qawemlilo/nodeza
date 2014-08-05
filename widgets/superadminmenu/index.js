
var config = require('./config.json');
var when = require('when');

module.exports = config;

config.exec = function () {
  config.collection = false;
  
  return when(config);
};