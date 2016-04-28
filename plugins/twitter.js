"use strict";

const when = require('when');
const Twitter = require('twitter');
const config = require('../config');
const client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessTokenKey,
  access_token_secret: config.twitter.accessTokenSecret
});

let Plugin  = null;

module.exports = function () {
  if (Plugin) {
    return Plugin;
  }

  Plugin  = {
    name: 'twitter'
  };

  Plugin.getTweets = function (twitterHandle, limit) {
    return when.promise(function(resolve, reject, notify) {
      let params = {
        screen_name: twitterHandle,
        limit: limit || 10
      };

      client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (error) {
          console.error(error);
          resolve(null);
        }
        else {
          resolve(tweets);
        }
      });
    });
  };

  return Plugin
};
