"use strict"

const redis = require('redis');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const mailGun = require('../lib/mailgun');
const resizer = path.resolve(__dirname, '../lib/process-images');

const Queue = redis.createClient();
const client = redis.createClient();

const MailQueue = 'mailQueue';

let workerBusy =  false;
let activeMessage = null;


// templates
let newMessageTmpl = fs.readFileSync(path.resolve(__dirname, '../views/emails/message.hbs'), 'utf8');
let newRegistrationTmpl = fs.readFileSync(path.resolve(__dirname, '../views/emails/welcome.hbs'), 'utf8');
let resetPasswordTmpl = fs.readFileSync(path.resolve(__dirname, '../views/emails/reset.hbs'), 'utf8');
let passwordChangedTmpl = fs.readFileSync(path.resolve(__dirname, '../views/emails/password_changed.hbs'), 'utf8');
let subscribeTmpl = fs.readFileSync(path.resolve(__dirname, '../views/emails/subscribe.hbs'), 'utf8');


function compressAndResize (imageUrl) {
  // We need to spawn a child process so that we do not block
  // the EventLoop with cpu intensive image manipulation
  let childProcess = require('child_process').fork(resizer);

  childProcess.on('message', function(message) {
    console.log(message);
  });

  childProcess.on('error', function(error) {
    console.error(error.stack)
  });

  childProcess.on('exit', function() {
    console.log('Child process exited');
  });

  childProcess.send(imageUrl);
}


// push all new actionz to MailQueue
Queue.on('message', function(channel, payload) {
  try {
    client.rpush(MailQueue, payload);
    mailWorker();
  }
  catch (e) {
    console.error(e)
  }
});


Queue.subscribe('email');


function mailWorker() {
  if (workerBusy) {
    return console.log(`> ${new Date().toISOString()} - Worker is busy`);
  }

  console.log(`> ${new Date().toISOString()} - Worker task called...`);

  client.lpop(MailQueue, async function(error, data) {
    try {
      if (error) {
         throw error;
         return false;
      }

      if (!data) {
        console.log(`> ${new Date().toISOString()} - Queue is empty`);
        return false;
      }

      workerBusy = true;

      activeMessage = data;

      let payload = JSON.parse(data);

      switch (payload.type) {
        case 'message':
          await sendMessage(payload);
        break;
        case 'registration':
          await newRegistration(payload)
        break;
        case 'reset':
          await resetPassword(payload)
        break;
        case 'password-changed':
          await passwordChanged(payload)
        break;
        case 'subscribe':
          await subscribe(payload)
        break;
        case 'subscription-confirm':
          await confirmSubscription(payload)
        break;
        case 'minify':
          compressAndResize(payload.url);
        break;
      }

      console.log(`> ${new Date().toISOString()} - Worker task complete`);

      workerBusy = false;

      mailWorker(); // queue has completed job, get next item in queue
    }
    catch (error) {
      workerBusy = false;
      console.error(error,activeMessage);
      mailWorker();
    }
  });
}


function sendMessage(data) {
  let template = hbs.handlebars.compile(newMessageTmpl);

  return mailGun.sendEmail({
    to: data.to.email,
    from: data.from.email,
    subject: `${data.from.name} has sent you a message on NodeZA`,
    body: template(data)
  });
}


function newRegistration (data) {
  let template = hbs.handlebars.compile(newRegistrationTmpl);

  return mailGun.sendEmail({
    to: data.to.email,
    subject: 'Welcome to NodeZA',
    body: template(data)
  });
}


function resetPassword (data) {
  let template = hbs.handlebars.compile(resetPasswordTmpl);

  return mailGun.sendEmail({
    to: data.to.email,
    subject: 'Reset your password on NodeZA',
    body: template(data)
  });
}


function passwordChanged (data) {
  let template = hbs.handlebars.compile(passwordChangedTmpl);

  return mailGun.sendEmail({
    to: data.to.email,
    subject: 'Your NodeZA password has been changed',
    body: template(data)
  });
}


function subscribe (data) {
  let template = hbs.handlebars.compile(subscribeTmpl);

  return mailGun.subscribe({
    to: data.to,
    subject: 'Confirm Subscription',
    body: template(data)
  });
}


function confirmSubscription (data) {
  return mailGun.confirmSubscription(data);
}

console.log(`> ${new Date().toISOString()} - Mail worker now active is listening to email channel`);
