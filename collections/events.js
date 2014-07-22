/**
 * Module dependencies.
**/
var Base  = require('./base');
var Event = require('../models/event');
var when = require('when');


var Events = Base.Collection.extend({

  model: Event,

  base: '/events'

});


module.exports = Base.collection('Events', Events);
