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
    client: 'mysql',
    connection: config.db.production,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'mysql',
    connection: config.db.staging,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
