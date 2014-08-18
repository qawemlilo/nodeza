
var config = require('./config.json');
var when = require('when');

// this makes the module config properties available in our template
module.exports.config = config;

module.exports.exec = function (App) {
  var site = App.getConfig('site');
  var menu = App.getModel('Menu', {name: 'Footer Menu'});

  // add some properties to the config object
  config.twitter = site.twitter_url;
  config.github = site.github_url;

  return menu.fetch({withRelated: ['links', 'links.route']})
  .then(function (model) {
    var collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }
    
    return collection;
  });
};