"use strict";

/**
 * Module dependencies.
 */

const App = require('widget-cms');


const Category =  App.Model.extend({


  tableName: 'categories',


  initialize: function () {

    App.Model.prototype.initialize.apply(this, arguments);


    this.on('saved', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });

    this.on('updated', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });
  },


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = App.addModel('Category', Category);
