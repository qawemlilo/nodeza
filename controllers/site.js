"use strict";

var App = require('widget-cms');


var SiteController = App.Controller.extend({

  /**
   * Get /
   * load home page
  */
  getIndex: function (req, res, next) {
    res.render('site/index',{
      title: App.config.site.title,
      description: App.config.site.description,
      page: 'home'
    });
  },


  getAbout: function (req, res, next) {
    res.render('site/about', {
      title: App.config.site.title,
      description: App.config.site.description,
      page: 'about'
    });
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
    res.render('site/developers', {
      title: 'NodeZA - developers',
      description: 'Invitation to contributors',
      page: 'developers'
    });
  },


  getContact: function (req, res, next) {
    res.render('site/contact', {
      title: 'NodeZA - Contact Us',
      description: 'Get in touch with us via email, twitter, or phone',
      page: 'contact'
    });
  },


  getPrivacy: function (req, res, next) {
    res.render('site/privacy', {
      title: 'NodeZA - Privacy',
      description: 'Privacy policy',
      page: 'privacy'
    });
  },


  postSubscribe: function (req, res) {
    var opts = {
      name: req.body.name,
      email: req.body.email,
      host: req.headers.host
    };

    mailGun.subscribe(opts, function (error, message) {
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
      subscribed: 'yes',
      host: req.headers.host
    };

    mailGun.confirmSubscription(opts, function (error, message) {
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
      subscribed: 'no',
      host: req.headers.host
    };

    mailGun.confirmSubscription(opts, function (error, message) {
      if (error) {
        console.log(error);
        req.flash('errors',  { msg: 'An error occured, please try again or contact us :('});
        return res.redirect('/');
      }

      req.flash('success',  {msg: 'You have successfully unsubscribed'});
      res.redirect('/');
    });
  }
});

module.exports = App.controller('Site', SiteController);
