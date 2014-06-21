
var config = require('./config.json');

module.exports = config;

module.exports.exec = function (req, res, collections) {
    var meetups = new collections.Meetups();

    meetups.limit = 2;

    return meetups.fetchItems()
    .then(function (collection) {

      config.collection = collection;

      return config;
    });
};