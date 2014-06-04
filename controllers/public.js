
var Events = require('../collections/events');
var Meetups = require('../collections/meetups');
var async = require('async');


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res, next) {
    var events = new Events();
    var meetups = new Meetups();
    var opts = {
      title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
      description: 'NodeZA is a community of Node.js developers in South Africa',
      page: 'home'
    };
    
    // display 3 upcoming events on the front page
    events.limit = 3;
    meetups.limit = 2;

    async.waterfall([
      function(done) {
        events.fetchItems()
        .then(function (collection) {
          done(false, collection.models);
        })
        .otherwise(function () {
          done('Could not fetch events collection');
        });
      },

      function (events, done) {
        opts.events = events;

        meetups.fetchItems()
        .then(function (collection) {
          done(false, collection.models);
        })
        .otherwise(function () {
          done('Could not fetch meetups collection');
        });
      },

      function (meetups, done) {
        opts.meetups = meetups;

        res.render('index', opts);

        done();
      }
    ]);
  },


  /**
   * Get /about
   * load about page
  */
  about: function (req, res) {
    res.render('about', {
      title: 'About',
      description: 'About NodeZA',
      page: 'about'
    });
  }
};

