
var Events = require('../collections/events');


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res) {
    var events = new Events();

    events.limit = 3;

    events.fetchItems(function (events, pagination) {
      res.render('index', {
        title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
        p: 'home',
        events: events,
        loggedIn: !!req.user
      });
    },
    function () {
      res.render('index', {
        title: 'Home',
        events: [],
        loggedIn: !!req.user
      });
    });
  },


  /**
   * Get /about
   * load about page
  */
  about: function (req, res) {
    res.render('about', {
      title: 'About',
      loggedIn: !!req.user
    });
  }
};

