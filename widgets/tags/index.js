
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {


	if (Cache) {
	  return when(Cache);
	}

  App.on('newentry', function (table) {
    if (table == 'posts') Cache = null;
  });

  var tags = App.getCollection('Tags');

  return tags.fetchTags(50)
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};