/**
 * Module dependencies.
 */
var Base  = require('./base');


var Company =  Base.Model.extend({

  tableName: 'companies',


  hasTimestamps: true,


  saving: function () {
    /*jshint unused:false*/
    var self = this;
    var desc = self.get('desc');

    if (self.hasChanged('desc') || self.isNew()) {
      desc = desc.replace(/\n\n\n/g, '<br>');
      desc = desc.replace(/\n\n/g, '<br>');
      desc = desc.replace(/\n/g, '<br>');
      self.set({desc: desc});
    }
    
    return Base.Model.prototype.saving.call(self);
  }
});


module.exports = Base.model('Company', Company);
