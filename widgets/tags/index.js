
var when = require('when');
var config = require('./config.json');


config.exec = function (App) {

  if (App.cacheExists('tags')) {
    return when(App.getCache('tags'));
  }

  App.on('newentry', function (table) {
    if (table == 'posts') Cache = null;
  });

  var tags = App.getCollection('Tags');

  return tags.fetchTags(50, {columns: ['slug', 'name']})
  .then(function (collection) {
    config.collection = collection;

    App.setCache('tags', config);
    
    return config;
  });
};


module.exports = config;