/**
 * Module dependencies.
**/
var MySql  = require('../config/db').Bookshelf;
var Category = require('../models/category');

var Categories = MySql.Collection.extend({

  model: Category

});

module.exports = MySql.collection('Categories', Categories);
