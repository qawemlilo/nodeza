"use strict";

const migrate = require('widget-knex-schema');
const albumsSchema = require('../schemas/albums');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'albums', albumsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('albums');
};
