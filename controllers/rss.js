
/*
  This file contains the program for creating an rss feed
*/

const App = require('widget-cms');
const RSS = require('rss');
const config = App.getConfig('site');
const Posts = App.getCollection('Posts');


/*
    Creates rss feed
*/
module.exports = function (req, res) {
  "use strict";

  config.baseUrl = config.baseUrl || 'http://' + req.headers.host;

  let feed = new RSS({
    title: config.siteName,
    description: config.description,
    feed_url: config.baseUrl + '/rss',
    site_url: config.baseUrl,
    language: 'en',
    author: config.siteName
  });

  return Posts.forge()
  .fetchBy('published_at', {
    page: 1,
    limit: config.rssLimit
  }, {
    columns: ['id', 'slug', 'title', 'user_id', 'meta_description', 'published_at'],
    withRelated: ['created_by']
  })
  .then(function (collection) {

    collection.forEach(function (post) {
      feed.item({
        guid: post.get('id'),
        title: post.get('title'),
        description: post.get('meta_description'),
        url: config.baseUrl + '/blog/' + post.get('slug'),
        author: post.related('created_by').get('name'),
        date: post.get('published_at')
      });
    });

    return feed.xml();
  });
};
