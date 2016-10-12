"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let meetups = App.getCollection('Meetups');

  return meetups.forge()
  .fetchBy('id', {
    limit: 2,
    noPagination: true,
    order: 'asc'
  },{
    columns: ['title', 'short_desc', 'slug', 'image_url']
  })
  .then(function (collection) {
    return collection;
  });
};
