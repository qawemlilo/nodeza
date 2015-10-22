"use strict";

/**
 * Blog categories collection
**/

var Bookshelf  = require('./base');
var Menu = require('../models/menu');

var Menus = Bookshelf.Collection.extend({

  model: Menu

});

module.exports = Bookshelf.collection('Menus', Menus);
