"use strict";

const config = require('./config.json');


function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}


module.exports.config = config;

module.exports.exec = function (App) {

  let Events = App.getCollection('Events');
  let events = new Events();

  return events.fetchBy('dt', {
    limit: 3,
    noPagination: true,
    where: ['dt', '<', datetime()]
  },
  {
    columns: ['slug', 'title']
  })
  .then(function (collection) {
    return collection;
  });
};
