
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {

	if (Cache) {
	  return when(Cache);
	}

  var events = new App.getCollection('Events');

  events.limit = 3;

  return events.fetchBy('dt', {
    limit: 3,
    where: ['dt', '>', new Date()],
    order: 'asc',
    noPagination: true
  })
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    return config;
  });
};