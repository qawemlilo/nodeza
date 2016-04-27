"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


let Menu = App.Model.extend({

  tableName: 'menus',


  hasTimestamps: true,


  access: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = App.addModel('Menu', Menu);
