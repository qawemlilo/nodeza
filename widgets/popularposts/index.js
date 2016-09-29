"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let Posts = App.getCollection('Posts');
  let posts = new Posts();

  return posts.fetchBy('views', {
    limit: 5,
    noPagination: true
  })
  .then(function (collection) {
    return collection;
  });
};
