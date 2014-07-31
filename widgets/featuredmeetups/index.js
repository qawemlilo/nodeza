
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {
	if (Cache) {
	  return when(Cache);
	}

  var meetups = App.getCollection('Meetups');

  return meetups.fetchBy('id', {
    limit: 2,
    noPagination: true,
    where: ['created_at', '<', new Date()]
  },{
    columns: ['name', 'short_desc', 'slug', 'image_url']
  })
  .then(function (collection) {
    config.collection = collection;
    Cache = config;

    return config;
  });
};