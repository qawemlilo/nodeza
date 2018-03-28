#!/usr/bin/env node

"use strict";

const Twitter = require('twit');
const axios = require('axios');
const moment = require('moment');
const util = require('util');
const config = require('../.env');


const tweeterClient = new Twitter({
  consumer_key: config.TWITTER_BOT_KEY,
  consumer_secret: config.TWITTER_BOT_SECRET,
  access_token: config.TWITTER_BOT_TOKEN_KEY,
  access_token_secret: config.TWITTER_BOT_TOKEN_SECRET
});


console.log();
console.log(' > Checking for new packages releases');
console.log();


async function findAndTweetNewReleases(name, url) {
  try {
    let res = await axios.get(url);
    let releases = res.data;

    if (releases && releases.length) {
      releases.forEach(function (release) {
        let hoursAgo = moment().diff(moment(release.published_at), 'hours');

        if (hoursAgo < 24) {
        let tweet = `New #${name} release: ${release.tag_name} - ${release.html_url}`;

          tweeterClient.post('statuses/update', { status: tweet }, function(error, data, response) {
            if (error) {
              console.error(error)
            }
          });
        }
      });
    }
    else {
      console.log(` > No #${name} new releases`);
    }
  }
  catch (error) {
    console.error(error);
  }
}


// nodejs
findAndTweetNewReleases('nodejs', 'https://api.github.com/repos/nodejs/node/releases');

// express
findAndTweetNewReleases('express', 'https://api.github.com/repos/expressjs/express/releases');
