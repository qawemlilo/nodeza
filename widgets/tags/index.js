
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

module.exports.exec = function (req, res, collections) {

	if (Cache) {
	  return when(Cache);
	}

  var tags = new collections.Tags();

  return tags.fetchTags(20)
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};