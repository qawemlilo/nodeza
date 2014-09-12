"use strict";

var App = require('../app');
var mailer = require('../lib/mailer');


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

    mailer(mailOptions, function(err, resp) {
      if (err) {
        console.log(err.message);
        req.flash('error', {msg: 'An error occured. Message not sent.'});
      }
      else {
        req.flash('success', {msg: 'You message has been successfully sent.'});
      }
      
      res.redirect('back');
    });
  }
};


module.exports = App.controller('Contact', ContactController);
