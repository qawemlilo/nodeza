"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Tweet = App.Model.extend({

  tableName: 'tweets',


  hasTimestamps: true,


  saving: function (model, attr, options) {
    this.set('payload', JSON.stringify(this.get('payload')));
  }

});

module.exports = App.addModel('Tweet', Tweet);
