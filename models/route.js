/**
 * Module dependencies.
 */


var Base  = require('./base');


var Route = Base.Model.extend({
	
  tableName: 'routes',


  hasTimestamps: true,


  role: function() {
    return this.belongsTo('Role');
  },


  links: function() {
    return this.hasMany('Link');
  }
});

module.exports = Base.model('Route', Route);
