/**
 * Blog categories collection
**/

var Bookshelf  = require('../app').bookshelf;
var Category = require('../models/category');

var Categories = Bookshelf.Collection.extend({

  model: Category

});

module.exports = Bookshelf.collection('Categories', Categories);
