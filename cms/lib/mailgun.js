"use strict";

var when = require('when');
var Mailgun = require('mailgun-js');
var config = require('../config');
var apiKey = config.mailgun.apiKey;
var domain = config.mailgun.domain;
var from_who = 'NodeZA <' + config.mailgun.email + '>';
var subject = 'Confirm Subscription';
var confirmSubscription;

var emailFooter = '<br><br><br>';
emailFooter += 'The NodeZA Team<br>';
emailFooter += '<small><a href="http://twitter.com/node_za">Twitter</a> | <a href="https://github.com/nodeza">Github</a></small>';


module.exports.confirmSubscription = confirmSubscription = function (opts, fn) {

  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});

  var members = [{
    address: opts.email,
    name: opts.name
  }];

  var newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  newsletterList.members()
  .add({members: members, subscribed: true}, fn);
};


module.exports.subscribe = function(opts, fn) {

  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  var newsletterList = mailgun.lists(config.mailgun.newsletterEmail);
  var html = 'Hi ' + opts.name + ',<br><br>';

  html += 'Thank you for subscribing to NodeZA, <a href="http://' + opts.host + '/subscribe/confirm/' + opts.email + '">please confirm your subscription</a>.';

  var member = {
    address: opts.email,
    name: opts.name,
    subscribed: false
  };

  var mailData = {
    from: from_who,
    to: opts.email,
    subject: 'Confirm Subscription',
    html: html + emailFooter
  };

  newsletterList.members()
  .create(member, function (err, data) {
    mailgun.messages().send(mailData, fn);
  });
};


module.exports.confirmSubscription = function (opts, fn) {

  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  var newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  newsletterList.members(opts.email)
  .update(opts, fn);
};


module.exports.sendEmail = function(opts) {
  return when.promise(function(resolve, reject, notify) {
    var mailgun = new Mailgun({apiKey: apiKey, domain: domain});
    var html = 'Hi ' + opts.name + ',<br><br>';

    var data = {
      from: opts.from || from_who,
      to: opts.to,
      subject: opts.subject,
      html: opts.body + emailFooter
    };

    mailgun.messages().send(data, function (error, res) {
      if (error) {
        reject(error);
      }
      else {
        resolve(res);
      }
    });
  });
};
