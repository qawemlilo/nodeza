"use strict";

const migrate = require('widget-knex-schema');
const usersSchema = require('../schemas/users');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'users', usersSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
