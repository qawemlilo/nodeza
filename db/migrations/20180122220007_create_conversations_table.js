"use strict";

const migrate = require('widget-knex-schema');
const conversationsSchema = require('../schemas/conversations');


exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'conversations', conversationsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('conversations');
};
