"use strict";

const migrate = require('widget-knex-schema');
const postsSchema = require('../schemas/posts');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'posts', postsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
