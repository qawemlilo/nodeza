"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Album = App.Model.extend({

  tableName: 'albums',


  hasTimestamps: true

});

module.exports = App.addModel('Album', Album);
