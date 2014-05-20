/**
 * Module dependencies.
 */
var MySql  = require('bookshelf').PG;
var moment = require('moment');


module.exports = MySql.Model.extend({

  tableName: 'events',


  hasTimestamps: true,


  parseDate: function (fmt) {
  	var dt = this.get('dt');

    return moment(dt).format(fmt || 'ddd MMM D YYYY');
  },


  isUpComing: function () {
    var dt = this.get('dt');
    var ts = this.get('start_time');

    var cleandate = moment(dt).format('YYYY-MM-DD') + ' ' + ts; 

    return moment(cleandate).unix() > moment().unix();
  },


  parseTime: function () {
  	var ts = this.get('start_time');

    return moment(ts, 'HH:mm:ss').format('HH:mm');
  }
});
