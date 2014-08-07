
var when = require('when');
var config = require('./config.json');


config.exec = function (App) {

  if (App.cacheExists('categories')) {
    return when(App.getCache('categories'));
  }

  var categories = App.getCollection('Categories');

  return categories.fetch({columns: ['slug', 'name']})
  .then(function (collection) {
    config.collection = collection;

    App.setCache('categories', config);
    
    return config;
  });
};


module.exports = config;