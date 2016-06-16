"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Route = App.Model.extend({

  tableName: 'routes',


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


  role: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = App.addModel('Route', Route);
