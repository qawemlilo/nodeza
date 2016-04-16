"use strict";

var when = require('when');
var Twitter = require('twitter');
var Plugin  = null;


module.exports = function (config) {
  if (Plugin) {
    return Plugin;
  }

  let client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessTokenKey,
    access_token_secret: config.twitter.accessTokenSecret
  });

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
