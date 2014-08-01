
var when = require('when');
var config = require('./config.json');

module.exports = config;

config.exec = function (App) {

  if (App.cacheExists('latestposts')) {
    return when(App.getCache('latestposts'));
  }

  App.on('newentry', function (table) {
    // clear the cache if a new post is added
    if (table == 'posts') Cache = null;
  });

  var posts = App.getCollection('Posts');

  return posts.fetchBy('published_at', {limit: 5, noPagination: true})
  .then(function (collection) {
    config.collection = collection;

    App.setCache('latestposts', config);
    
    return config;
  });
};