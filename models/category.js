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


  saving: function (model, attr, options) {
    // if is new or slug has changed and has slug field - generate new slug
    if (!this.get('slug') || this.hasChanged('slug')) {
      return this.generateSlug(this.get('slug') || this.get('name') || this.get('title'))
        .then( (slug) => {
          this.set({slug: slug});
        });
    }

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
  },


  hasTimestamps: true,


  posts: function () {
    return this.hasMany('Posts', 'category_id');
  }
});


module.exports = App.addModel('Category', Category);
