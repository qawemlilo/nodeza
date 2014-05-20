
var Events = require('../collections/events');


function getEvents (callback, err) {
    var events = new Events();

    events.sortby = 'dt';
    events.sortorder = 'asc';
  
    events.fetchItems(callback, err);
}



module.exports = {
  index: function (req, res) {
    getEvents(function (events, pagination) {
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


  about: function (req, res) {
    res.render('about', {
      title: 'About',
      loggedIn: !!req.user
    });
  }
};

