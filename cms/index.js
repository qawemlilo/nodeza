
"use strict";

/*
 *  Application point of entry
**/
var instance = null;

module.exports = (function () {
  if (!instance) {
    instance = require('./app');
  }

  return instance;
})();
