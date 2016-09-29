"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let categories = App.getCollection('Categories');

  return categories.forge()
  .fetch({columns: ['slug', 'name']})
  .then(function (collection) {
    return collection;
  });
};
