
var config = require('./config.json');
var when = require('when');

// this makes the module config properties available in our template
module.exports.config = config;

module.exports.exec = function (App) {

  // add some properties to the config object
  config.twitter = App.getConfig('twitter_url');
  config.github = App.getConfig('github_url');

  var menu = App.getModel('Menu', {name: 'Footer Menu'});

  return menu.fetch({withRelated: ['links', 'links.route']})
  .then(function (model) {
    var collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }
    
    return collection;
  });
};