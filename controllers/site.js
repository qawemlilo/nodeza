"use strict";

var App = require('../app');
var site = App.getConfig('site');
var rss = require('./rss');
var Newsletter = require('../lib/newsletter');


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
  },


  postSubscribe: function (req, res) {
    var opts = {
      name: req.body.name,
      email: req.body.email,
      host: req.headers.host
    };

    Newsletter.subscribe(opts, function (error, message) {
      if (error) {
        console.log(error);
        return res.status(501).send('An error occured');
      }

      res.end('Success!');
    });
  },


  getConfirmSubscription: function (req, res) {
    var opts = {
      email: req.params.email,
      subscribed: 'yes'
    };

    Newsletter.confirmSubscription(opts, function (error, message) {
      if (error) {
        console.log(error);
        req.flash('errors',  { msg: 'An error occured, subscription not confirmed :('});
        return res.redirect('/');
      }

      req.flash('success',  {msg: 'You have successfully subscribed to our website'});
      res.redirect('/');
    });
  },


  unSubscribe: function (req, res) {
    var opts = {
      email: req.params.email,
      subscribed: 'no'
    };

    Newsletter.confirmSubscription(opts, function (error, message) {
      if (error) {
        console.log(error);
        req.flash('errors',  { msg: 'An error occured, please try again or contact us :('});
        return res.redirect('/');
      }

      req.flash('success',  {msg: 'You have successfully unsubscribed'});
      res.redirect('/');
    });
  }
};

module.exports = App.controller('Site', SiteController);

