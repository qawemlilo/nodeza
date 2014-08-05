/**
 * Meetups collection
 */

var Base  = require('./base');
var Meetup = require('../models/meetup');



var Meetups = Base.Collection.extend({

  model: Meetup,

  base: '/meetups'

});


module.exports = Base.collection('Meetups', Meetups);
