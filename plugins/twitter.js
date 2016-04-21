"use strict";

const when = require('when');
const Twitter = require('twitter');
const config = require('../config');

let Plugin  = null;
let client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessTokenKey,
  access_token_secret: config.twitter.accessTokenSecret
});

module.exports = function () {
  if (Plugin) {
    return Plugin;
  }

  Plugin  = {
    name: 'twitter'
  };

  Plugin.getTweets = function (twitterHandle, limit) {
    return when.promise(function(resolve, reject, notify) {
      var params = {
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
