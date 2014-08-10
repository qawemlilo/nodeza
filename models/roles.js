/**
 * Module dependencies.
 */


var Base  = require('./base');


var Role = Base.Model.extend({
	
  tableName: 'roles',


  users: function() {
    return this.hasMany('Users');
  }
});

module.exports = Base.model('Role', Role);
