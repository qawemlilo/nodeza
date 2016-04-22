"use strict";

/**
 * Blog categories collection
**/

var App = require('widget-cms');
var Menu = require('../models/menu');

var Menus = App.Collection.extend({

  model: Menu

});

module.exports = App.addCollection('Menus', Menus);
