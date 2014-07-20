
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}

module.exports.exec = function (req, res, collections) {

    if (cache) {
      return when(cache);
    }
    var events = new collections.Events();

    events.limit = 3;
    events.whereQuery = ['dt', '<', datetime()];
    events.sort = 'dt';
    events.order = 'desc';

    return events.fetchItems()
    .then(function (collection) {

      config.collection = collection;

      cache = config;

      return config;
    });
};