"use strict";

/**
 * Module dependencies.
 */

var App = require('../cms');


var Category =  App.Model.extend({

  tableName: 'categories',


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = App.addModel('Category', Category);
