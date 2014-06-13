/**
 * Module dependencies.
 */


var MySql  = require('bookshelf').PG;


var Role = MySql.Model.extend({
	
  tableName: 'roles'

});

module.exports = MySql.model('Role', Role);
