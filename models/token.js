/**
 * Module dependencies.
 */


var MySql  = require('bookshelf').PG;
var User = require('./user');


module.exports = MySql.Model.extend({

  tableName: 'tokens'
  
});
