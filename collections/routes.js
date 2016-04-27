"use strict";

/**
 * Blog categories collection
**/

var App = require('widget-cms');
var Route = App.getModel('Route');

var Routes = App.Collection.extend({

  model: Route

});

module.exports = App.addCollection('Routes', Routes);
