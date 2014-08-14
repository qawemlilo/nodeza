
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('tags')) {
    return when(App.getCache('tags'));
  }

  App.on('newentry', function (table) {
    if (table == 'posts') Cache = null;
  });

  var tags = App.getCollection('Tags');

  return tags.fetchTags(50, {columns: ['slug', 'name']})
  .then(function (collection) {

    App.setCache('tags', collection);
    
    return collection;
  });
};
