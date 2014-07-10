
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (req, res, collections) {
    var posts = new collections.Posts();

    posts.limit = 5;
    posts.whereQuery = ['published_at', '<', new Date()];
    posts.andWhereQuery = ['published', '=', 1];
    posts.sort = 'id';
    posts.order = 'desc';

    config.globals = {
      title: 'Hello World!',
      description: 'Whatsup??' 
    };

    return posts.fetchItems()
    .then(function (collection) {
      config.collection = collection;

      return config;
    });
};