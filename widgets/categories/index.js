
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (collections) {
    var categories = new collections.Categories();

    return categories.fetch()
    .then(function (collection) {
      config.collection = collection;

      return config;
    });
};