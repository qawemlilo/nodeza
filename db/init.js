"use strict";

const fs = require('fs');
const path = require('path');
const config = require('./data/config.json');
const Prompt = require('simple-prompt');
const chalk = require('chalk');
const NODE_ENV = process.env.NODE_ENV;

config.site.sessionSecret = 'secret_' + Date.now();

if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
  //console.log(chalk.red(' \u26A0 WARNING: This action will destroy all the information in your database! \n'));
}

if (NODE_ENV && process.argv.length > 2 && (process.argv[2] === 'mysql' || process.argv[2] === 'pg')) {
  console.log(chalk.yellow('----------------------------------------------------------------------------'));
  console.log(chalk.yellow('\tHi there, lets start by setting up a connection to your %s database'), process.argv[2]);
  console.log(chalk.yellow('----------------------------------------------------------------------------'));
  console.log();

  const Questions = new Prompt([
    {question: 'Host', required: true},
    {question: 'Database Name', required: true},
    {question: 'Database User', required: true},
    {question: 'Password', required: true}
  ]);

  Questions.create()
  .then(function (err, answers) {
    config.db[NODE_ENV].client = process.argv[2];
    config.db[NODE_ENV].connection.host = answers.Host;
    config.db[NODE_ENV].connection.user = answers.DatabaseUser;
    config.db[NODE_ENV].connection.password = answers.Password;
    config.db[NODE_ENV].connection.database = answers.DatabaseName;

    createFiles(config);
  });
}
else {
  createFiles(config);
}



function createFiles(configObj) {
  let config_filepath = path.resolve(__dirname, '../config/config.json');
  let envVars = path.resolve(__dirname, '../.env.js');

  let config_data = JSON.stringify(configObj, null, 4);
  let env_data = `
  module.exports = {
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
  fs.writeFileSync(envVars, env_data, 'utf8');

  console.log();
  console.log(chalk.green(' > ') + ' Database details saved!');
  console.log();
}
