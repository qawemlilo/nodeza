
var Events = require('../collections/events');
var Meetups = require('../collections/meetups');
var Posts = require('../collections/posts');


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res, next) {
    var events = new Events();
    var meetups = new Meetups();
    var posts = new Posts();

    var opts = {
      title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
      description: 'NodeZA is a community of Node.js developers in South Africa',
      page: 'home'
    };
    
    // display 3 upcoming events on the front page
    events.limit = 3;
    meetups.limit = 2;
    
    // first fetch events
    events.fetchItems()
    .then(function (collection) {
      return collection.models;
    })
    .then(function (events) {
      opts.events = events;
      
      // then get meetups
      return meetups.fetchItems()
      .then(function (collection) {
        return collection.models;
      });
    })
    .then(function (meetups) {
      opts.meetups = meetups;
      
      // then get posts
      return posts.fetchFeatured(2)
      .then(function (collection) {
        return collection.models;
      });
    })
    .then(function (blogposts) {
      opts.posts = blogposts;

      res.render('index', opts);
    })
    .otherwise(function (error) {
      req.flash('errors', { msg: 'Could not fetch of the items'});
      res.render('index', opts);
      console.log(error);
    });
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

