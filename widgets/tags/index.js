"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let Tags = App.getCollection('Tags');
  let tags = new Tags();

  return tags.fetchTags(50, {
    columns: ['slug', 'name']
  })
  .then(function (collection) {
    return collection;
  });
};
