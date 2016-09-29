"use strict";

const migrate = require('widget-knex-schema');
const linksSchema = require('../schemas/links');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'links', linksSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('links');
};
