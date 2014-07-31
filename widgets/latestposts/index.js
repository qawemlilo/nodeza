
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App) {

  if(Cache) {
    return when(Cache);
  }

  App.on('newentry', function (table) {
    // clear the cache if a new post is added
    if (table == 'posts') Cache = null;
  });

  var posts = App.getCollection('Posts');

  return posts.fetchBy('published_at', {limit: 5, noPagination: true})
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};