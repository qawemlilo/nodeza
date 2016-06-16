"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Role = App.Model.extend({

  tableName: 'roles',


  initialize: function () {

    App.Model.prototype.initialize.apply(this, arguments);

    this.on('saved', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });

    this.on('updated', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });
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
