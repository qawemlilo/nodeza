/**
 * Module dependencies.
**/
var Base  = require('./base');
var Event = require('../models/event');
var when = require('when');
var moment = require('moment');


var Events = Base.Collection.extend({

  model: Event,

  base: '/events',


  parseMonth: function(mon) {
    var date = new Date();
    var lastday;
    var firstday;
    var year = date.getFullYear();
    var Months = {
      jan: {firstday: '01', month: '01', lastday: '31'},
      feb: {firstday: '01', month: '02', lastday: '28'},
      mar: {firstday: '01', month: '03', lastday: '31'},
      apr: {firstday: '01', month: '04', lastday: '30'},
      may: {firstday: '01', month: '05', lastday: '31'},
      jun: {firstday: '01', month: '06', lastday: '30'},
      jul: {firstday: '01', month: '07', lastday: '31'},
      aug: {firstday: '01', month: '08', lastday: '31'},
      sep: {firstday: '01', month: '08', lastday: '30'},
      oct: {firstday: '01', month: '10', lastday: '31'},
      nov: {firstday: '01', month: '11', lastday: '30'},
      dec: {firstday: '01', month: '12', lastday: '31'}
    };  
  
    var dateObj = Months[mon];
  
    firstday = year + '-' + dateObj.month + '-' +  dateObj.firstday;
    lastday = year + '-' + dateObj.month + '-' +  dateObj.lastday;
  
    firstday = moment(firstday, "YYYY-MM-DD").subtract('days', 1).format("YYYY-MM-DD");
    lastday = moment(lastday, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD");
    
    return { 
      firstday: firstday,
      lastday: lastday
    };
  }
});


module.exports = Base.collection('Events', Events);
