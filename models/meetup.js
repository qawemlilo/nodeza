/**
 * Module dependencies.
 */
var Base  = require('./base');
var markdown = require('markdown').markdown;
var _ = require('lodash');


var Meetup =  Base.Model.extend({

  tableName: 'meetups',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    this.set('html', markdown.toHTML(this.get('markdown')));
    this.set('title', this.get('title').trim());
    
    return Base.Model.prototype.saving.apply(this, _.toArray(arguments));
  }
});

module.exports = Base.model('Meetup', Meetup);
