
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (req, res, collections) {
    var posts = new collections.Posts();

    posts.whereQuery = ['published_at', '<', new Date()];

    return posts.fetchFeatured(2)
    .then(function (collection) {

      config.collection = collection;

      return config;
    });
};