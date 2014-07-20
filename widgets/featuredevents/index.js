
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

module.exports.exec = function (req, res, collections) {

	if (cache) {
	  return when(cache);
	}

    var events = new collections.Events();

    events.limit = 3;

    return events.fetchItems()
    .then(function (collection) {

      config.collection = collection;

      cache = config;

      return config;
    });
};