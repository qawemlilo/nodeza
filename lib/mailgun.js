"use strict";

const Promise = require('bluebird');
const Mailgun = require('mailgun-js');
const config = require('../config');

const apiKey = config.mailgun.apiKey;
const domain = config.mailgun.domain;
const from_who = 'NodeZA <' + config.mailgun.email + '>';


function sendEmail (opts) {
  if (process.env.NODE_ENV !== 'production') return Promise.resolve(new Error('You can only send emails in production'));

  return new Promise(function(resolve, reject) {
    let mailgun = new Mailgun({apiKey: apiKey, domain: domain});

    let data = {
      from: opts.from || from_who,
      to: opts.to,
      bcc: 'qawemlilo@gmail.com',
      subject: opts.subject,
      html: opts.body
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
}


function subscribe (opts) {
  if (!(apiKey && domain)) {
    return fn(new Error('Mailgun config not provided'))
  }

  let mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  let newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  let member = {
    address: opts.to.email,
    name: opts.to.name,
    subscribed: false
  };

  newsletterList
  .members()
  .create(member, function() {});

  return sendEmail({
    to: opts.to.email,
    subject: opts.subject,
    body: opts.body
  });
}


function confirmSubscription (opts) {

  if (!(apiKey && domain)) {
    return fn(new Error('Mailgun config not provided'))
  }

  let mailgun = new Mailgun({apiKey: apiKey, domain: domain});

  let members = [{
    address: opts.email
  }];

  let newsletterList = mailgun.lists(config.mailgun.newsletterEmail);

  return new Promise(function(resolve, reject) {
    newsletterList.members().add({members: members, subscribed: true}, function (error, res) {
      if(error) {
        reject(error)
      }
      else {
        resolve(res)
      }
    });
  });
}


module.exports.sendEmail = sendEmail;
module.exports.subscribe = subscribe;
module.exports.confirmSubscription = confirmSubscription;
