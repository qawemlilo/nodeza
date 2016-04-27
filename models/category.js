"use strict";

/**
 * Module dependencies.
 */

const App = require('widget-cms');


let Category =  App.Model.extend({

  tableName: 'categories',


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = App.addModel('Category', Category);
