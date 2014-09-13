"use strict";

var App = require('../app');
var site = App.getConfig('site');
var rss = require('./rss');


var SiteController = {

  /**
   * Get /
   * load home page
  */
  getIndex: function (req, res, next) {
    var opts = {
      title: site.title,
      description: site.description,
      page: 'home'
    };

    res.render('site/index', opts);
  },


  getAbout: function (req, res, next) {
    var opts = {
      title: site.title,
      description: site.description,
      page: 'about'
    };

    res.render('site/about', opts);
  },


  getRSS: function (req, res, next) {
    rss(req, res)
    .then(function (feed) {
      res.writeHead(200, {
        'Content-Type': 'application/xml; charset=utf-8'
      });
      
      res.end(feed);
    });
  },


  getDevelopers: function (req, res, next) {
    var opts = {
      title: 'NodeZA - developers',
      description: 'Invitation to contributors',
      page: 'developers'
    };

    res.render('site/developers', opts);
  },


  getContact: function (req, res, next) {
    var opts = {
      title: 'NodeZA - Contact Us',
      description: 'Get in touch with us via email, twitter, or phone',
      page: 'contact'
    };

    res.render('site/contact', opts);
  },


  getPrivacy: function (req, res, next) {
    var opts = {
      title: 'NodeZA - Privacy',
      description: 'Privacy policy',
      page: 'privacy'
    };

    res.render('site/privacy', opts);
  }
};

module.exports = App.controller('Site', SiteController);

