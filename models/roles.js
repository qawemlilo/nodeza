"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


let Role = App.Model.extend({

  tableName: 'roles',


  hasTimestamps: true,


  users: function() {
    return this.hasMany('Users');
  },


  routes: function() {
    return this.hasMany('Route');
  }
});

module.exports = App.addModel('Role', Role);
