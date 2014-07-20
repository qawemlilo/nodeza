
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

module.exports.exec = function (req, res, collections) {

	if (cache) {
	  return when(cache);
	}

    var tags = new collections.Tags();

    return tags.fetchTags(20)
    .then(function (collection) {
      config.collection = collection;

      cache = config;
      
      return config;
    });
};