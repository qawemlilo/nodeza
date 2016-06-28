"use strict";

const fs = require('fs');
const path = require('path');
const config = require('./data/config.json');
const Prompt = require('simple-prompt');
const chalk = require('chalk');

const questions = [
  {question: 'Host', required: true},
  {question: 'MySQL Database', required: true},
  {question: 'Database User', required: true},
  {question: 'Password', required: true}
];



console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log(chalk.yellow('\tHi there, lets start by setting up a connection to your MySQL database'));
console.log(chalk.yellow('----------------------------------------------------------------------------'));
console.log();


let dbSetup = new Prompt(questions);

dbSetup.create()
.then(function (err, answers) {

  config.mysql.host = answers.Host;
  config.mysql.user = answers.DatabaseUser;
  config.mysql.password = answers.Password;
  config.mysql.database = answers.MySQLDatabase;

  let config_filepath = path.resolve(__dirname, '../config/config.json');
  let dev_env = path.resolve(__dirname, '../.env.development.js');
  let prod_env = path.resolve(__dirname, '../.env.production.js');
  let test_env = path.resolve(__dirname, '../.env.testing.js');

  let config_data = JSON.stringify(config, null, 4);
  let env_data = `
  module.exports = {
    MYSQL_HOST: '${config.mysql.host}',
    MYSQL_PORT: null,
    MYSQL_USER: '${config.mysql.user}',
    MYSQL_PASSWORD: '${config.mysql.password}',
    MYSQL_DATABASE: '${config.mysql.database}',
    MAILGUN_USER: '',
    MAILGUN_PASSWORD: '',
    MAILGUN_KEY: '',
    MAILGUN_EMAIL: '',
    MAILGUN_NEWSLETTER: '',
    MAILGUN_DOMAIN: '',
    GITHUB_CLIENTID: '',
    GITHUB_SECRET: '',
    TWITTER_KEY: '',
    TWITTER_SECRET: '',
    TWITTER_TOKEN_KEY: '',
    TWITTER_TOKEN_SECRET: '',
    GOOGLE_CLIENTID: '',
    GOOGLE_SECRET: ''
  };`;

  fs.writeFileSync(config_filepath, config_data, 'utf8');
  fs.writeFileSync(dev_env, env_data, 'utf8');
  fs.writeFileSync(prod_env, env_data, 'utf8');
  fs.writeFileSync(test_env, env_data, 'utf8');

  console.log();
  console.log(chalk.green(' > ') + ' MySQL details saved!');
  console.log();
});
