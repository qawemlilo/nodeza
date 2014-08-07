
var when = require('when');
var config = require('./config.json');


config.exec = function (App) {

  if (App.cacheExists('latestposts')) {
    return when(App.getCache('latestposts'));
  }

  var posts = App.getCollection('Posts');

  return posts.fetchBy('published_at', {limit: 5, noPagination: true})
  .then(function (collection) {
    config.collection = collection;

    App.setCache('latestposts', config);
    
    return config;
  });
};


module.exports = config;