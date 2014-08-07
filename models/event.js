/**
 * Module dependencies.
 */

var Base  = require('./base');
var moment = require('moment');
var markdown = require('markdown').markdown;


var Event = Base.Model.extend({

  tableName: 'events',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    this.set('html', markdown.toHTML(this.get('markdown')));
    this.set('title', this.get('title').trim());
    
    return Base.Model.prototype.saving.apply(this, arguments);
  },


  /**
   * parses date
   */
  parseDate: function (fmt) {
  	var dt = this.get('dt');

    return moment(dt).format(fmt || 'ddd MMM D YYYY');
  },


  /**
   * Checks if its future event
   */
  isUpComing: function () {
    var dt = this.get('dt');
    var ts = this.get('start_time');

    var cleandate = moment(dt).format('YYYY-MM-DD') + ' ' + ts;

    return moment(cleandate).unix() > moment().unix();
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
