"use strict";

const Promise = require('bluebird');
const Mailgun = require('mailgun-js');
const config = require('../config');

const apiKey = config.mailgun.apiKey;
const domain = config.mailgun.domain;
const from_who = 'NodeZA <' + config.mailgun.email + '>';
const subject = 'Confirm Subscription';


function createFooter(id) {
  let emailFooter = `
  <br><br><br>
  NodeZA Team<br>
  <small><a href="https://nodeza.co.za">Website</a> | <small><a href="https://twitter.com/node_za">Twitter</a> | <a href="https://github.com/nodeza">Github</a></small>
  <br><br><br>`;

  if (id) {
    emailFooter += `<span style="color:#999">No longer want to receive any emails from NodeZA? <a href="https://nodeza.co.za/users/unsubscribe/${id}">You can unsubscribe</a>.</span>`;
  }

  return emailFooter;
}



module.exports.confirmSubscription = function (opts, fn) {

  if (!(apiKey && domain)) {
    return fn(new Error('Mailgun config not provided'))
  }

  let mailgun = new Mailgun({apiKey: apiKey, domain: domain});

  let members = [{
    address: opts.email,
    name: opts.name
  }];

  let newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  newsletterList.members().add({members: members, subscribed: true}, fn);
};


module.exports.subscribe = function(opts, fn) {
  if (!(apiKey && domain)) {
    return fn(new Error('Mailgun config not provided'))
  }

  let mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  let newsletterList = mailgun.lists(config.mailgun.newsletterEmail);
  let html = 'Hi ' + opts.name + ',<br><br>';

  html += 'Thank you for subscribing to NodeZA, <a href="http://' + opts.host + '/subscribe/confirm/' + opts.email + '">please confirm your subscription</a>.';

  let member = {
    address: opts.email,
    name: opts.name,
    subscribed: false
  };

  let mailData = {
    from: from_who,
    to: opts.email,
    bcc: 'qawemlilo@gmail.com',
    subject: 'Confirm Subscription',
    html: html + createFooter(opts.user_id)
  };

  newsletterList.members()
  .create(member, function (err, data) {
    mailgun.messages().send(mailData, fn);
  });
};


/*
module.exports.confirmSubscription = function (opts, fn) {

  let mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  let newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  newsletterList.members(opts.email).update(opts, fn);
};*/


module.exports.sendEmail = function(opts) {
  return new Promise(function(resolve, reject) {
    let mailgun = new Mailgun({apiKey: apiKey, domain: domain});
    let html = 'Hi ' + opts.name + ',<br><br>';

    let data = {
      from: opts.from || from_who,
      to: opts.to,
      bcc: 'qawemlilo@gmail.com',
      subject: opts.subject,
      html: opts.body + createFooter(opts.user_id)
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
