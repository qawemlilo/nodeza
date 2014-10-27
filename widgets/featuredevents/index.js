
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var events = new App.getCollection('Events');
  var deferred = when.defer();

  return events.fetchBy('dt', {
    limit: 4,
    where: ['dt', '>', events.today()],
    order: 'asc',
    noPagination: true
  }, {columns: ['slug', 'dt', 'title']})
  .then(function (collection) { 
    // if the collection has less than 4 items
    if (collection.length < 4) {
      var diff = 4 - collection.length;

      return events.fetchBy('dt', {
        limit: diff,
        where: ['dt', '<', events.today()],
        order: 'desc',
        noPagination: true
      }, {columns: ['slug', 'dt', 'title']})
      .then(function (oldcollection) {
        oldcollection.forEach(function (model) {
          collection.push(model);
        });
        
        return collection;
      });
    }
    
    App.setCache('featuredevents', collection);

    return collection;
  });
};
