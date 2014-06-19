
var config = require('./config.json');
var when = require('when');

module.exports = config;

module.exports.exec = function (collections) {
  config.collection = false;
  
  return when(config);
};