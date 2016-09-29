"use strict";

const _ = require('lodash');
const config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  let Events = App.getCollection('Events');
  let events = new Events();

  return events.fetchBy('dt', {
    limit: 4,
    where: ['dt', '>', new Date()],
    order: 'asc',
    noPagination: true
  }, {columns: ['slug', 'dt', 'title']})
  .then(function (collection) {
    // if the collection has less than 4 items
    if (collection.length < 4) {
      let diff = 4 - collection.length;

      return events.fetchBy('dt', {
        limit: diff,
        where: ['dt', '<', new Date()],
        order: 'desc',
        noPagination: true
      }, {columns: ['slug', 'dt', 'title']})
      .then(function (oldcollection) {
        oldcollection.forEach(function (model) {
          collection.push(model);
        });

        return collection;
      });
    }

    return collection;
  });
};
