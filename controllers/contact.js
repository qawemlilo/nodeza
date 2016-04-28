"use strict";

var App = require('../app');
var mailGun = require('../lib/mailgun');


var ContactController = {

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
      res.redirect('back');
    });
  }
};


module.exports = App.controller('Contact', ContactController);
