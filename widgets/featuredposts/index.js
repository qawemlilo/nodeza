"use strict";

const config = require('./config.json');

module.exports.config = config;

module.exports.exec = function (App) {

  let Posts = App.getCollection('Posts');
  let posts = new Posts();

  return posts.featured(2, {
    columns: ['slug', 'title', 'published_at', 'html']
  })
  .then(function (collection) {
    return collection;
  });
};
