"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Menu = App.Model.extend({

  tableName: 'menus',


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


  access: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = App.addModel('Menu', Menu);
