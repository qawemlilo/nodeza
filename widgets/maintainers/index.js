
var when = require('when');
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var users = new App.getCollection('Users');
  var deferred = when.defer();

  return users.fetchBy('id', {
    limit: 10,
    where: ['role_id', '=', 3],
    order: 'asc',
    noPagination: true
  })
  .then(function (collection) { 
    // if the collection has less than 4 items
    /*
    var maintainers = collection.map(function (model) {
      return {
        slug: model.get('slug'),
        gravatar: model.gravatar(48),
        name: model.get('name'),
        twitter_url: model.get('twitter_url')
      };
    });*/

    return collection;
  });
};
