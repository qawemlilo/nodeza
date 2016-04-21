
var when = require('when');
var config = require('./config.json');

module.exports.config = config;

module.exports.exec = function (App) {

  var Posts = App.getCollection('Posts');
  var posts = new Posts();

  return posts.featured(2, {
    columns: ['slug', 'title', 'published_at', 'html']
  })
  .then(function (collection) {
    return collection;
  });
};
