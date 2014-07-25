
var config = require('./config.json');
var when = require('when');

module.exports = config;

config.exec = function (req, res, collections) {
  config.collection = false;
  
  return when(config);
};