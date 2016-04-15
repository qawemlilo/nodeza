"use strict";

/**
 * Module dependencies.
 */


var Base = require('../cms').Bookshelf;


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
