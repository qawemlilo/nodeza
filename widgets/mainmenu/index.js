
var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var menu = App.getModel('Menu', {name: 'Main Menu'});

  return menu.fetch({withRelated: ['links', 'links.route']})
  .then(function (model) {
    var collection = model.related('links');

    if (!collection.length) {
      collection = null;
    }
    
    return collection;
  });
};