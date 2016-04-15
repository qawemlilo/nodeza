"use strict";

var running = false;

module.exports = function (mongodbUrl) {

  if (running) {
    return false;
  }

  var mongoose = require('mongoose');

  mongoose.connect(mongodbUrl);

  mongoose.connection.on('error', function() {
    console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
    running = false;
  });

  mongoose.connection.on('open', function() {
    console.info('✔ MongoDB connected.');
    running = true;
  });

  return true;
};
