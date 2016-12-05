"use strict";

/**
 * Events collection
**/
const App = require('widget-cms');
const nodeEvent = App.getModel('Event');
const moment = require('moment');


const Events = App.Collection.extend({

  model: nodeEvent,


  base: '/events',


  parseMonth: function(mon) {
    let date = new Date();
    let lastday;
    let firstday;
    let year = date.getFullYear();
    let Months = {
      jan: {firstday: '01', month: '01', lastday: '31'},
      feb: {firstday: '01', month: '02', lastday: '28'},
      mar: {firstday: '01', month: '03', lastday: '31'},
      apr: {firstday: '01', month: '04', lastday: '30'},
      may: {firstday: '01', month: '05', lastday: '31'},
      jun: {firstday: '01', month: '06', lastday: '30'},
      jul: {firstday: '01', month: '07', lastday: '31'},
      aug: {firstday: '01', month: '08', lastday: '31'},
      sep: {firstday: '01', month: '09', lastday: '30'},
      oct: {firstday: '01', month: '10', lastday: '31'},
      nov: {firstday: '01', month: '11', lastday: '30'},
      dec: {firstday: '01', month: '12', lastday: '31'}
    };

    let dateObj = Months[mon];

    firstday = year + '-' + dateObj.month + '-' +  dateObj.firstday;
    lastday = year + '-' + dateObj.month + '-' +  dateObj.lastday;

    firstday = moment(firstday, "YYYY-MM-DD").subtract(1, 'days').format("YYYY-MM-DD");
    lastday = moment(lastday, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");

    return {
      firstday: firstday,
      lastday: lastday
    };
  },


  fetchMonth: function (month, options, fetchOptions) {
    let self = this;
    let monthObj = self.parseMonth(month);

    options = options || {};

    options.where = ['dt', '>', monthObj.firstday];
    options.andWhere = ['dt', '<', monthObj.lastday];

    return self.fetchBy('dt', options, fetchOptions);
  },


  today: function () {
    return moment();
  }
});


module.exports = App.addCollection('Events', Events);
