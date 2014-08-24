"use strict";

var fs = require('fs');
var path = require('path');
var secrets = require('./data/secrets');
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

  secrets.mysql.host = answers.Host;
  secrets.mysql.user = answers.DatabaseUser;
  secrets.mysql.password = answers.Password;
  secrets.mysql.db = answers.MySQLDatabase;

  var filepath = path.resolve(__dirname, '../config/secrets.json');
  var data = JSON.stringify(secrets, null, 4);

  fs.writeFileSync(filepath, data, 'utf8');
    
  console.log();
  console.log(chalk.green(' > ') + ' MySQL details saved!');
  console.log();
});