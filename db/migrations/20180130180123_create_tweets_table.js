"use strict";

const migrate = require('widget-knex-schema');
const tweetsSchema = require('../schemas/tweets');


exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'tweets', tweetsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tweets');
};
