
var Events = require('../collections/events');


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res) {
    var events = new Events();
    
    // display 3 upcoming events on the front page
    events.limit = 3;

    events.fetchItems()
    .then(function (collection) {
      res.render('index', {
        title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
        events: collection.models
      });
    })
    .otherwise(function () {
      res.render('index', {
        title: 'Home',
        events: []
      });
    });
  },


  /**
   * Get /about
   * load about page
  */
  about: function (req, res) {
    res.render('about', {
      title: 'About'
    });
  }
};

