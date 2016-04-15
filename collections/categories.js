"use strict";

/**
 * Blog categories collection
**/

var Base = require('../cms').Bookshelf;

var Category = require('../models/category');


var Categories = Base.Collection.extend({

  model: Category

});

module.exports = Base.collection('Categories', Categories);
