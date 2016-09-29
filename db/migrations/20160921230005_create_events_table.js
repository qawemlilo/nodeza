"use strict";

const migrate = require('widget-knex-schema');
const eventsSchema = require('../schemas/events');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'events', eventsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('events');
};
