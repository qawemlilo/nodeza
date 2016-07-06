"use strict";

/**
 * Module dependencies.
 */

const App = require('widget-cms');


const Category =  App.Model.extend({


  tableName: 'categories',


  updated: function(model, attributes, options) {
    if (App.getConfig('cache')) {
      App.clearCache();
    }
  },


  saved: function(model, attributes, options) {
    if (App.getConfig('cache')) {
      App.clearCache();
    }
  },


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = App.addModel('Category', Category);
