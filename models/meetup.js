/**
 * Module dependencies.
 */
var Base  = require('./base');


var Meetup =  Base.Model.extend({

  tableName: 'meetups',


  hasTimestamps: true,


  saving: function (model, attr, options) {
    /*jshint unused:false*/
    var self = this;
    var desc = self.get('desc');

    if (self.hasChanged('desc') || self.isNew()) {
      desc = desc.replace(/\n\n\n/g, '<br>');
      desc = desc.replace(/\n\n/g, '<br>');
      desc = desc.replace(/\n/g, '<br>');
      self.set({desc: desc});
    }
    
    return Base.Model.prototype.saving.apply(self, arguments);
  }
});

module.exports = Base.model('Meetup', Meetup);
