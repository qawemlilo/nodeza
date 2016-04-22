"use strict";

/**
 * Meetups collection
 */

var App = require('widget-cms');
var Meetup = require('../models/meetup');



var Meetups = App.Collection.extend({

  model: Meetup,

  base: '/meetups'

});


module.exports = App.addCollection('Meetups', Meetups);
