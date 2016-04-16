"use strict";

/**
 * Module dependencies.
 */


var Base = require('widget-cms').Bookshelf;


var Route = Base.Model.extend({

  tableName: 'routes',


  hasTimestamps: true,


  role: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = Base.model('Route', Route);
