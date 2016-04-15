
var config = require('./config.json');
var when = require('when');


module.exports.config = config;

module.exports.exec = function (App) {

  if (App.cacheExists('mainmenu')) {
    return when(App.getCache('mainmenu'));
  }

  var menu = App.getModel('Menu', {name: 'Main Menu'});

  return menu.fetch({withRelated: ['links', 'links.route']})
  .then(function (model) {
    var collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }

    App.getCache('mainmenu', collection);

    return collection;
  });
};
