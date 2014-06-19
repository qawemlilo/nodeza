
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (collections) {
    var events = new collections.Events();

    events.limit = 3;

    return events.fetchItems()
    .then(function (collection) {

      config.collection = collection;

      return config;
    });
};