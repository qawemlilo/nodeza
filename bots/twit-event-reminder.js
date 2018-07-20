"use strict";

const Twitter = require('twit');
const moment = require('moment');
const config = require('../.env');
const appConfig = require('../config');
const env = process.env.NODE_ENV || 'production';


if (!appConfig.db[env]) {
  console.log(' > Config not found');
  return process.exit(1);
}

const knex = require('knex')(appConfig.db[env]);


async function findAndTweetDueEvents (done) {
  try {

    const tweeterClient = new Twitter({
      consumer_key: config.TWITTER_BOT_KEY,
      consumer_secret: config.TWITTER_BOT_SECRET,
      access_token: config.TWITTER_BOT_TOKEN_KEY,
      access_token_secret: config.TWITTER_BOT_TOKEN_SECRET
    });

    const jobQueue = [];


    let events = await knex('events').where({dt: moment().format('YYYY-MM-DD')});

    if (events && events.length) {
      events.forEach(function (event, i) {
        let tweet = `#nodejs event happening today in #${event.city} https://nodeza.co.za/events/${event.slug}`;

        jobQueue.push(event.id);

        tweeterClient.post('statuses/update', {status: tweet}, function(error, data, response) {
          if (error) {
            console.error(error)
          }
          else {
            console.log(' > ' + tweet);
          }

          jobQueue.shift();

          done(jobQueue);
        });
      });
    }
    else {
      console.log(' > No events due today');
      process.exit(1);
    }
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
}


findAndTweetDueEvents(function (jobQueue) {
  if (jobQueue.length) {
    return console.log(' > still working: %s', jobQueue.length);
  }

  console.log(' > complete');
  process.exit(1);
});
