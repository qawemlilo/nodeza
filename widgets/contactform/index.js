
var config = require('./config.json');
var when = require('when');


config.exec = function (App, collections) {
  config.collection = false;
  
  return when(config);
};


module.exports = config;