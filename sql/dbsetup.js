"use strict";

var fs = require('fs');
var path = require('path');
var config = require('./data/config.json');
var Prompt = require('simple-prompt');
var chalk = require('chalk');

var questions = [
  {question: 'Host', required: true},
  {question: 'MySQL Database', required: true},
  {question: 'Database User', required: true},
  {question: 'Password', required: true}
];



console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log(chalk.yellow('\tHi there, lets start by setting up a connection to your MySQL database'));
console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log();


var dbSetup = new Prompt(questions);

dbSetup.create()
.then(function (err, answers) {

  config.mysql.host = answers.Host;
  config.mysql.user = answers.DatabaseUser;
  config.mysql.password = answers.Password;
  config.mysql.database = answers.MySQLDatabase;

  var filepath = path.resolve(__dirname, '../config/config.json');
  var data = JSON.stringify(config, null, 4);

  fs.writeFileSync(filepath, data, 'utf8');

  console.log();
  console.log(chalk.green(' > ') + ' MySQL details saved!');
  console.log();
});
