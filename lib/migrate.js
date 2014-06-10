
var Bookshelf  = require('bookshelf');
var secrets = require('../config/secrets.json');

/*
  Bookshelf initialization
*/
Bookshelf.PG = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: secrets.mysql.host,
    user: secrets.mysql.user,
    password: secrets.mysql.password,
    database: secrets.mysql.db,
    charset: secrets.mysql.charset
  }
});


var _ = require('lodash');
var when = require('when');
var sequence = require('when/sequence');
var data = require('../sql/data');
var User = require('../models/user');
var schema = require('../sql/schema');
var schemaTables = _.keys(schema);
var Prompt = require('simple-prompt');
var chalk = require('chalk');
var questions = [
  {
    question: 'Name',
    required: true, 
    validate: function (answer) {
        return answer.length >= 3; 
    }
  },
  {
    question: 'Email',
    required: true, 
    validate: function (answer) {
        return answer.indexOf('@') > 0; 
    }
  },
  {
    question: 'Password',
    required: true, 
    validate: function (answer) {
        return answer.length >= 6; 
    }
  }
];

var knex = Bookshelf.PG.knex;


function createTable(tableName) {
  console.log(chalk.green(' > ') + 'Creating ' + tableName + ' table....');
 
  return knex.schema.createTable(tableName, function (table) {
    
    var column,
        columnKeys = _.keys(schema[tableName]);
    _.each(columnKeys, function (key) {
      // creation distinguishes between text with fieldtype, string with maxlength and all others
      if (schema[tableName][key].type === 'text' && schema[tableName][key].hasOwnProperty('fieldtype')) {
        column = table[schema[tableName][key].type](key, schema[tableName][key].fieldtype);
      } 
      else if (schema[tableName][key].type === 'string' && schema[tableName][key].hasOwnProperty('maxlength')) {
        column = table[schema[tableName][key].type](key, schema[tableName][key].maxlength);
      } 
      else {
        column = table[schema[tableName][key].type](key);
      }
      if (schema[tableName][key].hasOwnProperty('nullable') && schema[tableName][key].nullable === true) {
        column.nullable();
      } else {
        column.notNullable();
      }
      if (schema[tableName][key].hasOwnProperty('primary') && schema[tableName][key].primary === true) {
        column.primary();
      }
      if (schema[tableName][key].hasOwnProperty('unique') && schema[tableName][key].unique) {
        column.unique();
      }
      if (schema[tableName][key].hasOwnProperty('unsigned') && schema[tableName][key].unsigned) {
        column.unsigned();
      }
      if (schema[tableName][key].hasOwnProperty('references') && schema[tableName][key].hasOwnProperty('inTable')) {
        //check if table exists?
        column.references(schema[tableName][key].references);
        column.inTable(schema[tableName][key].inTable);
      }
      if (schema[tableName][key].hasOwnProperty('defaultTo')) {
        column.defaultTo(schema[tableName][key].defaultTo);
      }
    });
  });
}




function deleteTable(table) {
  return knex.schema.dropTableIfExists(table);
}





function createDB () {
  var tables = [];

  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Application init. Creating database tables.....'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  tables = _.map(schemaTables, function (table) {
    return function () {
      return createTable(table);
    };
  });

  return sequence(tables).then(function () {
    console.log(chalk.green(' > ') + 'Database tables created!');
    return data.populate();
  });
}



/**
 * GET /blog
 * load blog page
 */



module.exports = {
  /*
   * create database
  **/
  init: function () {
    var deferred = when.defer();
    var profile = new Prompt(questions);

    createDB()
    .then(function () {
      console.log();
      console.log(chalk.yellow('--------------------------------------------------------'));
      console.log('\t%s', chalk.yellow('Now creating your Super Admin account'));
      console.log(chalk.yellow('--------------------------------------------------------'));
      console.log();

      profile.create()
      .then(function (error, answers) {
        var details = {name: answers.Name, email: answers.Email, password: answers.Password};

        details.role_id = 3;

        User.forge(details)
        .save()
        .then(function (model) {
          console.log('');
          console.log(chalk.green(' > ') + 'Super Admin accout created!');
          console.log('');

          data.addPost(model.get('id'))
          .then(function (d) {
            console.log(chalk.red('WARNING!! Running the `node setup` command again will delete and reset your databases.\n        Remove the setup.js file in the root directory to avoid this.'));
            console.log('');
            console.log(chalk.yellow('--------------------------------------------------------'));
            console.log(chalk.yellow('\tCongratulations! Setup is complete!!!\n\tRun the command `node app` to start your app'));
            console.log(chalk.yellow('--------------------------------------------------------'));
            console.log();
            deferred.resolve();
          });
        })
        .otherwise(function () {
          console.log(chalk.red(' > ') + 'Sorry ' + details.name + ', your Super Admin accout could not be created. Please open an issues on our github page.');
          deferred.reject();
        });
      });
    })
    .otherwise (function (err) {
      throw err;
    });

    return deferred.promise;
  },


  /*
   * Reset
   * Delete all tables from the database in reverse order
  **/
  reset: function () {
    var tables = [];

    tables = _.map(schemaTables, function (table) {
      return function () {
        return deleteTable(table);
      };
    }).reverse();
    
    return sequence(tables);
  }
};