
var when = require('when');
var config = require('./config.json');


function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}

config.exec = function (App) {

  if (App.cacheExists('recentevents')) {
    return when(App.getCache('recentevents'));
  }

  var events = App.getCollection('Events');

  return events.fetchBy('dt', {
    limit: 3,
    noPagination: true,
    where: ['dt', '<', datetime()]
  }, 
    {columns: ['slug', 'title']
  })
  .then(function (collection) {
    config.collection = collection;

    App.setCache('recentevents', config);

    return config;
  });
};


module.exports = config;