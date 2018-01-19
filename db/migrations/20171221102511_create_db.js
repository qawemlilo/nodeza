'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function(knex, Promise) {
  //let sql = fs.readFileSync('db/data/nodeza.sql').toString();

  //return knex.raw(sql);
  //return new Promise('Cannot drop the entire database');
};

exports.down = function(knex, Promise) {
  //return Promise.resolve('Cannot drop the entire database');
};
