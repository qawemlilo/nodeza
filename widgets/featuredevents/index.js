
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('featuredevents')) {
    return when(App.getCache('featuredevents'));
  }

  var events = new App.getCollection('Events');
  var deferred = when.defer();

  return events.fetchBy('dt', {
    limit: 4,
    where: ['dt', '>', new Date()],
    order: 'asc',
    noPagination: true
  }, {columns: ['slug', 'dt', 'title']})
  .then(function (collection) {
    // if the collection has less than 4 items
    if (collection.length < 4) {
      var diff = 4 - collection.length;

      return events.fetchBy('dt', {
        limit: diff,
        where: ['dt', '<', new Date()],
        order: 'desc',
        noPagination: true
      }, {columns: ['slug', 'dt', 'title']})
      .then(function (oldcollection) {
        oldcollection.forEach(function (model) {
          collection.push(model);
        });

        App.setCache('featuredevents', collection);

        return collection;
      });
    }

    App.setCache('featuredevents', collection);

    return collection;
  });
};
