"use strict";

/**
 * Module dependencies.
 */
 
var Base  = require('./base');


var Category =  Base.Model.extend({

  tableName: 'categories',


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = Base.model('Category', Category);
