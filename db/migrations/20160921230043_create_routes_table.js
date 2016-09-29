"use strict";

const migrate = require('widget-knex-schema');
const routesSchema = require('../schemas/routes');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'routes', routesSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('routes');
};
