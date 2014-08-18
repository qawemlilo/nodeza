
var config = require('../config');
var Bookshelf = require('../dbconnect')(config);
var knex = Bookshelf.knex;


var _ = require('lodash');
var when = require('when');
var sequence = require('when/sequence');
var data = require('./data');
var User = require('../models/user');
var schema = require('./schema');
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


function createTable(table) {
  console.log(chalk.green(' > ') + 'Creating ' + table + ' table....');

  return knex.schema.createTable(table, function (t) {
    var columnKeys = _.keys(schema[table]);

    _.each(columnKeys, function (column) {
      return addTableColumn(table, t, column);
    });
  });
}


function addTableColumn(tablename, table, columnname) {
    var column;
    var columnSpec = schema[tablename][columnname];

    // creation distinguishes between text with fieldtype, string with maxlength and all others
    if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
      column = table[columnSpec.type](columnname, columnSpec.fieldtype);
    } 
    else if (columnSpec.type === 'string' && columnSpec.hasOwnProperty('maxlength')) {
      column = table[columnSpec.type](columnname, columnSpec.maxlength);
    } 
    else {
      column = table[columnSpec.type](columnname);
    }

    if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
      column.nullable();
    }
    else {
      column.notNullable();
    }

    if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
      column.primary();
    }

    if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
      column.unique();
    }

    if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
      column.unsigned();
    }

    if (columnSpec.hasOwnProperty('references')) {
      //check if table exists?
      column.references(columnSpec.references);
    }

    if (columnSpec.hasOwnProperty('defaultTo')) {
      column.defaultTo(columnSpec.defaultTo);
    }
}


function deleteTable(table) {
  return knex.schema.dropTableIfExists(table);
}





function createDB () {
  var tables = [];

  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Creating database tables.......'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  tables = _.map(schemaTables, function (table) {
    return function () {
      return createTable(table);
    };
  });

  return sequence(tables).then(function () {
    return data.populateFirst();
  });
}



var migrate = {
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
      console.log('\t%s', chalk.yellow('Create your Super Admin account'));
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
          console.log(chalk.green(' > ') + 'Super Admin account created!');
          console.log('');
  
          return model;
        })
        .then(function (user) {
          data.populateSecond()
          .then(function () {
            deferred.resolve();
          })
          .otherwise (function (err) {
            deferred.reject(err);
          });
        })
        .otherwise(function (error) {
          console.log(chalk.red(' > ') + 'Sorry ' + details.name + ', your Super Admin account could not be created. Please open an issues on our github page.');
          deferred.reject(error);
        });
      });
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


migrate.reset()
.then(function () {
  migrate.init()
  .then(function () {
    console.log();
    console.log(chalk.red('WARNING!! Running the `npm run setup` command again will delete and reset your databases.\n        Remove the sql/dbsetup.js file in the root directory to avoid this.'));
    console.log('');
    console.log(chalk.yellow('--------------------------------------------------------'));
    console.log(chalk.yellow('\tCongratulations! Setup is complete!!!\n\tRun the command `npm start` to start your app'));
    console.log(chalk.yellow('--------------------------------------------------------'));
    console.log();
    process.exit(0);
  })
  .otherwise(function (err) {
    console.log(err);
    process.exit(1);
  });
});