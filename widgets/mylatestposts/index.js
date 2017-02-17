"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let posts = App.getCollection('Posts');

  return posts.forge()
  .fetchBy('id', {
    limit: 5,
    noPagination: true,
    order: 'desc'
  })
  .then(function (collection) {
    return collection;
  });
};
