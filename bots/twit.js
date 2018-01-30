"use strict";


const Twitter = require('twitter');
const config = require('../config');
const client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessTokenKey,
  access_token_secret: config.twitter.accessTokenSecret
});


module.exports.tweet = function (type, data) {
  let twit = '';

  if (process.env.NODE_ENV !== 'production') return Promise.resolve(null);

  switch (type) {
    case 'post':
      twit = 'New #nodejs post: ' + data.title + ' - ' + data.url;
    break;
    case 'event':
      twit = 'Upcoming #nodejs event: ' + data.title + ' - ' + data.url;
    break;
  }

  return client.post('statuses/update', {status: twit});
}
