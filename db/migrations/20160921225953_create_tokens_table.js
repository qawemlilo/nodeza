"use strict";

const migrate = require('widget-knex-schema');
const tokensSchema = require('../schemas/tokens');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'tokens', tokensSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tokens');
};
