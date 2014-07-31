
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {

	if (Cache) {
		return when(Cache);
	}

  var posts = App.getCollection('Posts');

  return posts.featured(2)
  .then(function (collection) {
    config.collection = collection;
    Cache = config;

    return config;
  });
};