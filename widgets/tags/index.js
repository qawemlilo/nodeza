
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  App.on('newentry', function (table) {
    if (table === 'posts') App.setCache('tags', null);
  });

  var tags = App.getCollection('Tags');

  return tags.fetchTags(50, {columns: ['slug', 'name']})
  .then(function (collection) {
    
    return collection;
  });
};
