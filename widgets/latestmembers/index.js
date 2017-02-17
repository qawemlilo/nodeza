"use strict";

const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let users = App.getCollection('Users');

  return users.forge()
  .fetchBy('id', {
    limit: 4,
    noPagination: true,
    order: 'desc'
  },{
    columns: ['name','email','slug','location','bio']
  })
  .then(function (collection) {
    return collection;
  });
};
