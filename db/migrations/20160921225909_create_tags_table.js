"use strict";

const migrate = require('widget-knex-schema');
const tagsSchema = require('../schemas/tags');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'tags', tagsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tags');
};
