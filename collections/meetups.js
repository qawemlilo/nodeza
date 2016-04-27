"use strict";

/**
 * Meetups collection
 */

const App = require('widget-cms');
const Meetup = App.getModel('Meetup');



let Meetups = App.Collection.extend({

  model: Meetup,

  base: '/meetups'

});


module.exports = App.addCollection('Meetups', Meetups);
