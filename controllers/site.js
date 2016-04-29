"use strict";

const App = require('widget-cms');
const mailGun = require('../lib/mailgun');
const RSS = require('rss');


const SiteController = App.Controller.extend({

  /**
   * Get /
   * load home page
  */
  getIndex: function (req, res, next) {
    res.render('site/index',{
      title: App._config.site.title,
      description: App._config.site.description,
      page: 'home'
    });
  },


  getAbout: function (req, res, next) {
    res.render('site/about', {
      title: App._config.site.title,
      description: App._config.site.description,
      page: 'about'
    });
  },


  getRSS: function (req, res, next) {
    let config = App.getConfig('site');
    let Posts = App.getCollection('Posts');

    config.baseUrl = config.baseUrl || 'http://' + req.headers.host;

    let feed = new RSS({
      title: config.siteName,
      description: config.description,
      feed_url: config.baseUrl + '/rss',
      site_url: config.baseUrl,
      language: 'en',
      author: config.siteName
    });

    Posts.forge()
    .fetchBy('published_at', {
      page: 1,
      limit: config.rssLimit
    }, {
      columns: ['id', 'slug', 'title', 'user_id', 'meta_description', 'published_at'],
      withRelated: ['created_by']
    })
    .then(function (collection) {

      collection.forEach(function (post) {
        feed.item({
          guid: post.get('id'),
          title: post.get('title'),
          description: post.get('meta_description'),
          url: config.baseUrl + '/blog/' + post.get('slug'),
          author: post.related('created_by').get('name'),
          date: post.get('published_at')
        });
      });

      res.end(feed.xml());
    })
    .catch(function (error) {
      next(error);
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
    let opts = {
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
    let opts = {
      email: req.params.email,
      subscribed: 'yes',
      host: req.headers.host
    };

    mailGun.confirmSubscription(opts, function (error, message) {
      if (error) {
        console.error(error);
        req.flash('errors',  { msg: 'An error occured, subscription not confirmed :('});
        return res.redirect('/');
      }

      req.flash('success',  {msg: 'You have successfully subscribed to our website'});
      res.redirect('/');
    });
  },


  unSubscribe: function (req, res) {
    let opts = {
      email: req.params.email,
      subscribed: 'no',
      host: req.headers.host
    };

    mailGun.confirmSubscription(opts, function (error, message) {
      if (error) {
        console.error(error);
        req.flash('errors',  { msg: 'An error occured, please try again or contact us :('});
        return res.redirect('/');
      }

      req.flash('success',  {msg: 'You have successfully unsubscribed'});
      res.redirect('/');
    });
  },

  postContact: function(req, res, next) {
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('email', 'Not a valid email').isEmail();
    req.assert('message', 'Message must be at least 12 characters long').len(12);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var mailOptions = {
      to: req.body._email,
      from: req.body.name + ' <' + req.body.email + '>',
      subject: req.body.subject,
      body: req.body.message
    };

    mailGun.sendEmail(mailOptions)
    .then(function (data) {
      req.flash('success', {msg: 'Your message has been successfully sent.'});
      res.redirect('back');
    })
    .catch(function (error) {
      console.error(error);
      req.flash('error', {msg: 'An error occured. Message not sent.'});
      next(error);
    });
  }
});

module.exports = App.addController('Site', SiteController);
