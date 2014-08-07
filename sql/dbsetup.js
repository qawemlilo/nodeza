
var fs = require('fs');
var path = require('path');
var secrets = require('../config/secrets.json');
var Prompt = require('simple-prompt');
var chalk = require('chalk');

var questions = [
  {
    question: 'Host',
    required: true,
    default: 'localhost'
  },
  {
    question: 'MySQL Database',
    required: true,
    default: 'test'
  },
  {
    question: 'Database User',
    required: true,
    default: 'root'
  },
  {
    question: 'Password',
    required: true,
    default: ''
  }
];



console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log(chalk.yellow('\tHi there, lets start by setting up your MySQL database'));
console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log();


var dbSetup = new Prompt(questions);

dbSetup.create().then(function (err, answers) {

  secrets.mysql.host = answers.Host;
  secrets.mysql.user = answers.DatabaseUser;
  secrets.mysql.password = answers.Password;
  secrets.mysql.db = answers.MySQLDatabase;

  var filepath = path.resolve(__dirname, '../config/secrets.json');
  var data = JSON.stringify(secrets, null, 4);

  fs.writeFileSync(filepath, data, 'utf8');
    
  console.log();
  console.log(chalk.green(' > ') + ' Database setup complete!');
  console.log();
});