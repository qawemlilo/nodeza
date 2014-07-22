/**
 * Module dependencies.
**/
var Bookshelf  = require('../config/db').Bookshelf;
var Category = require('../models/category');

var Categories = Bookshelf.Collection.extend({

  model: Category

});

module.exports = Bookshelf.collection('Categories', Categories);
