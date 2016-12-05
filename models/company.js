"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');


const Company =  App.Model.extend({

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
  }
});


module.exports = App.addModel('Company', Company);
