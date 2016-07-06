"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');


const Company =  App.Model.extend({

  tableName: 'companies',


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


  saving: function () {
    /*jshint unused:false*/
    let desc = this.get('desc');

    if (this.hasChanged('desc') || this.isNew()) {
      desc = desc.replace(/\n\n\n/g, '<br>');
      desc = desc.replace(/\n\n/g, '<br>');
      desc = desc.replace(/\n/g, '<br>');

      this.set({desc: desc});
    }
  }
});


module.exports = App.addModel('Company', Company);
