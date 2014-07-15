/**
 * Module dependencies.
 */


var Base  = require('./base');


var Token = Base.Model.extend({

  tableName: 'tokens'
  
});


module.exports = Base.model('Token', Token);
