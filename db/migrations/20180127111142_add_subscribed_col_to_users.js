
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    return table.boolean('subscribed').defaultTo(true).after('views');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    return table.dropColumn('subscribed');
  });
};
