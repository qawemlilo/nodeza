"use strict";

const config = require('./config.json');

// this makes the module config properties available in our template
module.exports.config = config;

module.exports.exec = function (App) {

  let site = App.getConfig('site');
  let Menu = App.getModel('Menu');
  let menu = new Menu({name: 'Footer Menu'});

  // add some properties to the config object
  config.twitter = site.twitter_url;
  config.github = site.github_url;

  return menu.fetch({
    withRelated: ['links', 'links.route']
  })
  .then(function (model) {
    let collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }

    return collection;
  });
};
