"use strict";

const App = require('widget-cms');
const Twitter = require('twit');
const config = require('../.env');


const client = new Twitter({
  consumer_key: config.TWITTER_BOT_KEY,
  consumer_secret: config.TWITTER_BOT_SECRET,
  access_token: config.TWITTER_BOT_TOKEN_KEY,
  access_token_secret: config.TWITTER_BOT_TOKEN_SECRET
});


module.exports.tweet = function (type, payload) {
  let tweet = '';

  if (process.env.NODE_ENV !== 'production') return false;

  switch (type) {
    case 'post':
      tweet = `New post #nodejs #javascript: ${payload.title} ${payload.body}`;
    break;
    case 'event':
      tweet = `Upcoming #nodejs event in ${payload.city}:  ${payload.title} ${payload.body}`;
    break;
    case 'text':
      tweet = payload.title ? payload.title + ' ' + payload.body : payload.body;
    break;
  }

  if (!tweet) return false;

  client.post('statuses/update', { status: tweet }, function(err, data, response) {
    if (err) {
      console.error(err)
    }
    else {
      const Tweet = App.getModel('Tweet');

      Tweet.forge({type: type, payload: payload})
      .save()
      .then(function (tweet) {
        console.error('Tweet saved to db')
      })
      .catch(function (error) {
        console.error(error)
      });
    }

  });
}
