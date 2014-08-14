/**
 * Module dependencies.
 */


var Base  = require('./base');


var LinkModel = Base.Model.extend({
	
  tableName: 'links',


  hasTimestamps: true,


  route: function() {
    return this.belongsTo('Route');
  },


  menu: function() {
    return this.belongsTo('Menu');
  }
});

module.exports = Base.model('Link', LinkModel);
