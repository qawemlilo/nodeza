"use strict";

/**
 * Module dependencies.
 */


let App = require('widget-cms');


let Route = App.Model.extend({

  tableName: 'routes',


  hasTimestamps: true,


  role: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = App.addModel('Route', Route);
