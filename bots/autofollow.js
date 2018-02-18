"use strict";

const Twitter = require('twit');
const config = require('../.env');


const client = new Twitter({
  consumer_key: config.TWITTER_BOT_KEY,
  consumer_secret: config.TWITTER_BOT_SECRET,
  access_token: config.TWITTER_BOT_TOKEN_KEY,
  access_token_secret: config.TWITTER_BOT_TOKEN_SECRET
});


const stream = client.stream('node_za');


stream.on('follow', function (res) {
  twitter.post('friendships/create', {
    screen_name: res.source.screen_name
  }, function (err, data, response) {
   console.log('AutoFollowed @' + res.source.screen_name);
 });
});

console.log(`> ${new Date().toISOString()} - Running auto-follow bot`);
