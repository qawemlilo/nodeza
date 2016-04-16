"use strict";

/**
 * Module dependencies.
 */
var App = require('widget-cms');


var Company =  App.Model.extend({

  tableName: 'companies',


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

    return App.Model.prototype.saving.call(this);
  }
});


module.exports = App.addModel('Company', Company);
