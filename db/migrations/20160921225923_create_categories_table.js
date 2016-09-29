"use strict";

const migrate = require('widget-knex-schema');
const categoriesSchema = require('../schemas/categories');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'categories', categoriesSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('categories');
};
