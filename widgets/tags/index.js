
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var Tags = App.getCollection('Tags');
  var tags = new Tags();

  return tags.fetchTags(50, {
    columns: ['slug', 'name']
  })
  .then(function (collection) {
    return collection;
  });
};
