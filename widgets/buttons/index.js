"use strict";

const config = require('./config.json');
const Promise = require('bluebird');

module.exports.config = config;

module.exports.exec = function (App) {
  return Promise.resolve(null);
};
