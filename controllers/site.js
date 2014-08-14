
var App = require('../app');


var SiteController = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res, next) {
    var opts = {
      title: 'Welcome to NodeZA, a Node.js information portal for developers in South Africa',
      description: 'NodeZA is a platform that aims to make it easy to find information about Node.js, learn, and connect with other Node users in South Africa',
      page: 'home'
    };

    res.render('site/index', opts);
  },


  about: function (req, res, next) {
    var opts = {
      title: 'A Node.js information portal and social platform for developers in South Africa',
      description: 'NodeZA is a platform that aims to make it easy to find information about Node.js, learn, and connect with other Node users in South Africa',
      page: 'about'
    };

    res.render('site/about', opts);
  },


  developers: function (req, res, next) {
    var opts = {
      title: 'NodeZA - developers',
      description: 'Invitation to contributors',
      page: 'developers'
    };

    res.render('site/developers', opts);
  },


  contact: function (req, res, next) {
    var opts = {
      title: 'NodeZA - Contact Us',
      description: 'Get in touch with us via email, twitter, or phone',
      page: 'contact'
    };

    res.render('site/contact', opts);
  },


  privacy: function (req, res, next) {
    var opts = {
      title: 'NodeZA - Privacy',
      description: 'Privacy policy',
      page: 'privacy'
    };

    res.render('site/privacy', opts);
  }
};

module.exports = App.controller('Site', SiteController);

