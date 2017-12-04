"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let Menu = App.getModel('Menu');
  let menu = new Menu({name: 'Main Menu'});

  return menu.fetch({
    withRelated: [{links: function(query) { query.orderBy('created_at', 'desc') }}, 'links.route']
  })
  .then(function (model) {
    let collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }

    return collection;
  });
};
