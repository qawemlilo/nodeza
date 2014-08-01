
var when = require('when');
var config = require('./config.json');

module.exports = config;

config.exec = function (App) {

  if (App.cacheExists('featuredevents')) {
    return when(App.getCache('featuredevents'));
  }

  var events = new App.getCollection('Events');

  events.limit = 3;

  return events.fetchBy('dt', {
    limit: 3,
    where: ['dt', '>', new Date()],
    order: 'asc',
    noPagination: true
  }, {
    columns: ['slug', 'dt', 'title']
  })
  .then(function (collection) {
    config.collection = collection;

    App.setCache('featuredevents', config);

    return config;
  });
};