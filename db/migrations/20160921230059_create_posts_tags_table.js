"use strict";

const migrate = require('widget-knex-schema');
const postsTagsSchema = require('../schemas/posts_tags');

exports.up = function(knex, Promise) {
  return migrate.createTable(knex, 'posts_tags', postsTagsSchema, true);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts_tags');
};
