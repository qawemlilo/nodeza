/**
 * Module dependencies.
 */


var Base  = require('./base');


var Role = Base.Model.extend({
	
  tableName: 'roles'

});

module.exports = Base.model('Role', Role);
