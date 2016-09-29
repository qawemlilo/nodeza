"use strict";

const migrate = require('widget-knex-schema');
const rolesSchema = require('../schemas/roles');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'roles', rolesSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('roles');
};
