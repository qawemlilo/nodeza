
var config = require('./config.json');
var when = require('when');


module.exports.config = config;

module.exports.exec = function (App) {

  var Menu = App.getModel('Menu');
  var menu = new Menu({name: 'Main Menu'});

  return menu.fetch({
    withRelated: ['links', 'links.route']
  })
  .then(function (model) {
    var collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }

    return collection;
  });
};
