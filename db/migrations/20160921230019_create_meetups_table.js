"use strict";

const migrate = require('widget-knex-schema');
const meetupsSchema = require('../schemas/meetups');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'meetups', meetupsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('meetups');
};
