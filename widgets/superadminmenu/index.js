
var config = require('./config.json');
var when = require('when');


config.exec = function () {
  config.collection = false;
  
  return when(config);
};


module.exports = config;