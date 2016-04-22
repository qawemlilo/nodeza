"use strict";

/**
 * Blog categories collection
**/

var App = require('widget-cms');
var LinkModel = require('../models/link');

var Links = App.Collection.extend({

  model: LinkModel

});

module.exports = App.addCollection('Links', Links);
