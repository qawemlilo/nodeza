"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Role = App.Model.extend({

  tableName: 'roles',


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


  users: function() {
    return this.hasMany('Users');
  },


  routes: function() {
    return this.hasMany('Route');
  }
});

module.exports = App.addModel('Role', Role);
