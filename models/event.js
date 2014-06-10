/**
 * Module dependencies.
 */

var MySql  = require('bookshelf').PG;
var moment = require('moment');


module.exports = MySql.Model.extend({

  tableName: 'events',


  hasTimestamps: true,


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
