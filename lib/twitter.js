

var when = require('when');
var Twitter = require('twitter');
var config = require('../config');

var client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessTokenKey,
  access_token_secret: config.twitter.accessTokenSecret
});

module.exports.getTweets = function (twitterHandle, limit) {
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
