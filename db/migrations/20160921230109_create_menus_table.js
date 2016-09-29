"use strict";

const migrate = require('widget-knex-schema');
const menusSchema = require('../schemas/menus');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'menus', menusSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('menus');
};
