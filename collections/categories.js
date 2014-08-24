"use strict";

/**
 * Blog categories collection
**/

var Base  = require('./base');
var Category = require('../models/category');

var Categories = Base.Collection.extend({

  model: Category

});

module.exports = Base.collection('Categories', Categories);
