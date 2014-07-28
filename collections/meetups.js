/**
 * Meetups collection
 */

var Base  = require('./base');
var Meetup = require('../models/meetup');
var when = require('when');



var Meetups = Base.Collection.extend({

  model: Meetup

});


module.exports = Base.collection('Meetups', Meetups);
