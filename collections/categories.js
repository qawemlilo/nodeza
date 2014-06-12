/**
 * Module dependencies.
**/
var MySql  = require('bookshelf').PG;
var Category = require('../models/category');

module.exports = MySql.Collection.extend({

  model: Category

});
