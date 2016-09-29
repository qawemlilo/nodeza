"use strict";

const migrate = require('widget-knex-schema');
const imagesSchema = require('../schemas/images');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'images', imagesSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('images');
};
