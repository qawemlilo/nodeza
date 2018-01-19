"use strict";

const config = require('./config');


module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './development.sqlite'
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: './testing.sqlite'
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/testing'
    }
  },


  production: {
    client: config.db.production.client,
    connection: config.db.production.connection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },

    useNullAsDefault: true
  },

  staging: {
    client: config.db.staging.client,
    connection: config.db.staging.connection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    useNullAsDefault: true
  }

};
