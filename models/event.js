"use strict";

/**
 * Module dependencies.
 */

var Base  = require('./base');
var moment = require('moment');
var markdown = require('markdown').markdown;
var _ = require('lodash');


var Event = Base.Model.extend({

  tableName: 'events',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    this.set('html', markdown.toHTML(this.get('markdown')));
    this.set('title', this.get('title').trim());
    
    return Base.Model.prototype.saving.apply(this, _.toArray(arguments));
  },


  /**
   * parses date
   */
  parseDate: function (fmt) {
  	var dt = this.get('dt');

    return moment(dt).format(fmt || 'ddd MMM D YYYY');
  },


  /**
   * parses time
   */
  parseTime: function (fmt) {
  	var ts = this.get('start_time');

    return moment(ts, 'HH:mm:ss').format(fmt || 'HH:mm');
  }
});



module.exports = Base.model('Event', Event);
