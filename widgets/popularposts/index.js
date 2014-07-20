
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

module.exports.exec = function (req, res, collections) {
   
    if (cache) {
        return when(cache);
    }

    var posts = new collections.Posts();

    posts.limit = 5;
    posts.whereQuery = ['published_at', '<', new Date()];
    posts.andWhereQuery = ['published', '=', 1];
    posts.order = 'desc';
    posts.sortby = 'views';
    

    return posts.fetchItems()
    .then(function (collection) {
      config.collection = collection;

      cache = config;

      return config;
    });
};