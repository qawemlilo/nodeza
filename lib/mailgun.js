"use strict";

const Promise = require('bluebird');
const Mailgun = require('mailgun-js');
const config = require('../config');
const apiKey = config.mailgun.apiKey;
const domain = config.mailgun.domain;
const from_who = 'NodeZA <' + config.mailgun.email + '>';


function sendEmail (opts) {
  console.log({
    from: from_who,
    to: opts.to,
    subject: opts.subject,
    html: opts.body
  });
  
  return new Promise(function(resolve, reject) {
    resolve({});
  });
}


function subscribe (opts) {
  return new Promise(function(resolve, reject) {
    resolve({});
  });
}


function confirmSubscription (opts) {
  return new Promise(function(resolve, reject) {
    resolve({});
  });
}


module.exports.sendEmail = sendEmail;
module.exports.subscribe = subscribe;
module.exports.confirmSubscription = confirmSubscription;
