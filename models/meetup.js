"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');
const markdown = require('markdown-it')();
const _ = require('lodash');


const Meetup =  App.Model.extend({

  tableName: 'meetups',


  hasTimestamps: true
  
});

module.exports = App.addModel('Meetup', Meetup);
