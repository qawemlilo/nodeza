"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    return table.dateTime('last_login').nullable().after('subscribed');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    return table.dropColumn('last_login');
  });
};
