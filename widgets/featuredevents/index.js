
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('featuredevents')) {
    return when(App.getCache('featuredevents'));
  }

  var events = new App.getCollection('Events');

  events.limit = 3;

  return events.fetchBy('dt', {
    limit: 3,
    where: ['dt', '>', events.today()],
    order: 'asc',
    noPagination: true
  }, {
    columns: ['slug', 'dt', 'title']
  })
  .then(function (collection) {
    
    App.setCache('featuredevents', collection);

    return collection;
  });
};
