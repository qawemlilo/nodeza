
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

module.exports.exec = function (req, res, collections) {
	if (cache) {
	  return when(cache);
	}

    var meetups = new collections.Meetups();

    meetups.limit = 2;

    return meetups.fetchItems()
    .then(function (collection) {

      config.collection = collection;

      cache = config;

      return config;
    });
};