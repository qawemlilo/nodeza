
var config = require('./config.json');

module.exports.config = config;

module.exports.exec = function (collections) {
    var categories = new collections.Categories();
    var locals = {};

    return categories.fetch()
    .then(function (collection) {
      locals.categories = collection;
      return locals;
    });
};