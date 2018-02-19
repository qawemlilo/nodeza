"use strict";

const Twitter = require('twit');
const config = require('../.env');


const client = new Twitter({
  consumer_key: config.TWITTER_BOT_KEY,
  consumer_secret: config.TWITTER_BOT_SECRET,
  access_token: config.TWITTER_BOT_TOKEN_KEY,
  access_token_secret: config.TWITTER_BOT_TOKEN_SECRET
});


const stream = client.stream('user');


stream.on('follow', function (res) {
  console.log('> @' + res.source.screen_name + ' is now following @node_za');
  client.post('friendships/create', { screen_name: res.source.screen_name }, function (error, data, response) {
   if (error) {
     console.error(error);
   }
   else {
     console.log('> NodeZA TweetBot auto followed @' + res.source.screen_name);
   }
  });
});

stream.on('error', function (error) {
  console.log(error)
});

console.log(`> ${new Date().toISOString()} - Running auto-follow bot`);
