
var when = require('when');
var config = require('./config.json');
var Cache = null;

module.exports = config;

config.exec = function (App, collections) {
   
  if (Cache) {
    return when(Cache);
  }

  var posts = new collections.Posts();
    

  return posts.fetchBy('views', {limit: 5})
  .then(function (collection) {
    config.collection = collection;
    Cache = config;
    
    return config;
  });
};