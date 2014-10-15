

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
  var html = 'Hi ' + opts.name + ',<br><br>';

  html += 'You have successfully subscribed to <a href="http://www.nodeza.co.za">NodeZA</a>, lookout for all our latest updates.';

  var data = {
    from: from_who,
    to: opts.email, 
    subject: 'NodeZA Subscription',
    html: html + emailFooter
  };

  confirmSubscription(opts, function (error, res) {
    mailgun.messages().send(data, function(err, responss){});
    fn(error, res);
  });
};


module.exports.confirmSubscription = function (opts, fn) {

  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});

  var members = [{
    address: opts.email,
    name: opts.name
  }];

  var newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  newsletterList.members()
  .add({members: members, subscribed: true}, fn);
};


module.exports.email = function(opts, fn) {

  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  var html = 'Hi ' + opts.name + ',<br><br>';

  var data = {
    from: from_who,
    to: opts.to, 
    subject: opts.subject,
    html: opts.body + emailFooter
  };

  mailgun.messages().send(data, fn);
};
