/**
 * Module dependencies.
 */


var MySql  = require('bookshelf').PG;


var Token = MySql.Model.extend({

  tableName: 'tokens'
  
});


module.exports = MySql.model('Token', Token);
