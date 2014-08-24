"use strict";

/**
 * Module dependencies.
 */


var Base  = require('./base');


var Role = Base.Model.extend({
	
  tableName: 'roles',


  hasTimestamps: true,


  users: function() {
    return this.hasMany('Users');
  },


  routes: function() {
    return this.hasMany('Route');
  }
});

module.exports = Base.model('Role', Role);
