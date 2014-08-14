
var when = require('when');
var config = require('./config.json');


module.exports.config = config;


module.exports.exec = function (App) {

  var menu = App.getModel('Menu', {name: 'Main Menu'});

  return menu.fetch({withRelated: ['access', 'links', 'links.route']})
  .then(function (model) {
    var collection = model.related('links');
 
    // expose access permission to config
    config.access = model.related('access').toJSON();

    if (!collection.length) {
      collection = null;
    }
    
    return collection;
  });
};