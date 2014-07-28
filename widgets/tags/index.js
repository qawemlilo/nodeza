
var when = require('when');
var config = require('./config.json');
var Cache = null;
var listenerSet = false;

module.exports = config;

config.exec = function (App, collections) {


	if (Cache) {
	  return when(Cache);
	}

  var tags = new collections.Tags();

  return tags.fetchTags(50)
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};