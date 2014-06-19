
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (collections) {
    var posts = new collections.Posts();

    return posts.fetchFeatured(1)
    .then(function (collection) {

      config.collection = collection;

      return config;
    });
};