
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var posts = App.getCollection('Posts');
    

  return posts.fetchBy('views', {limit: 5, noPagination: true})
  .then(function (collection) {
    
    return collection;
  });
};