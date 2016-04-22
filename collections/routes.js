"use strict";

/**
 * Blog categories collection
**/

var App = require('widget-cms');
var Route = require('../models/route');

var Routes = App.Collection.extend({

  model: Route

});

module.exports = App.addCollection('Routes', Routes);
