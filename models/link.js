"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const LinkModel = App.Bookshelf.Model.extend({

  tableName: 'links',


  updated: function(model, attributes, options) {
    if (App.getConfig('cache')) {
      App.clearCache();
    }
  },


  saved: function(model, attributes, options) {
    if (App.getConfig('cache')) {
      App.clearCache();
    }
  },


  hasTimestamps: true,


  route: function() {
    return this.belongsTo('Route');
  },


  menu: function() {
    return this.belongsTo('Menu');
  }
});

//module.exports = Base.model('Link', LinkModel);
module.exports = App.addModel('Link', LinkModel);
