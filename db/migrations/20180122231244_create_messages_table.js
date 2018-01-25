"use strict";

const migrate = require('widget-knex-schema');
const messagesSchema = require('../schemas/messages');


exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'messages', messagesSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('messages');
};
