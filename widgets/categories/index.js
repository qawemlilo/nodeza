
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('categories')) {
    return when(App.getCache('categories'));
  }

  var categories = App.getCollection('Categories');

  return categories.fetch({columns: ['slug', 'name']})
  .then(function (collection) {
 
    App.setCache('categories', collection);
    
    return collection;
  });
};


