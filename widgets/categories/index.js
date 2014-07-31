
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {

	if (Cache) {
	  return when(Cache);
	}

  var categories = App.getCollection('Categories');

  return categories.fetch()
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};