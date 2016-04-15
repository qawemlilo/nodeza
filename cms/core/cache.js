"use strict";

var Store = {};


function cacheExists(key) {
  return !!Store[key];
}


module.exports.set = function (key, val) {
  Store[key] = val;
};


module.exports.get = function (key) {
  return Store[key]
};


module.exports.exists = function (key) {
  return cacheExists(key);
};
