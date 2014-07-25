
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (req, res, collections) {

	if (Cache) {
	  return when(Cache);
	}

  var events = new collections.Events();

  events.limit = 3;

  return events.fetchBy('dt', {
    limit: 3,
    where: ['dt', '>', new Date()],
    order: 'asc'
  })
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    return config;
  });
};