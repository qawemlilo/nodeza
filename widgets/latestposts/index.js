
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('latestposts')) {
    return when(App.getCache('latestposts'));
  }

  var posts = App.getCollection('Posts');

  return posts.fetchBy('published_at', {limit: 5, noPagination: true})
  .then(function (collection) {

    App.setCache('latestposts', collection);
    
    return collection;
  });
};
