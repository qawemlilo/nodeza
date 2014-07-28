
var when = require('when');
var config = require('./config.json');
var Cache = null;
var listenerSet = false;

module.exports = config;

config.exec = function (App, collections) {

  if(Cache) {
    return when(Cache);
  }

  App.on('newentry', function (table) {
    if (table == 'posts') Cache = null;
  });

  var posts = new collections.Posts();

  return posts.fetchBy('published_at', {limit: 5})
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};