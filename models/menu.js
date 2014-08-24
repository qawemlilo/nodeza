"use strict";

/**
 * Module dependencies.
 */


var Base  = require('./base');


var Menu = Base.Model.extend({
	
  tableName: 'menus',


  hasTimestamps: true,


  access: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = Base.model('Menu', Menu);
