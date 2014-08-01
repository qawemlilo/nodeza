


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var pkg = require('./package.json');
var config = require('./config/secrets');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');
var Cache = {};


var emitter = new EventEmitter();
var App = {};


App.version = pkg.version;


App.bookshelf = Bookshelf;


App.on = function () {
  emitter.on.apply(this, _.toArray(arguments));
};


App.emit = function () {
  emitter.emit.apply(this, _.toArray(arguments));
};


App.getModel = function (name, options) {
  if (Bookshelf._models[name]) {
    return new Bookshelf._models[name](options);
  }
};


App.getCollection = function (name, options) {
  if (Bookshelf._collections[name]) {
  	return new Bookshelf._collections[name](options);
  }
};


App.getCache = function (name) {
  return Cache[name];
};


App.setCache = function (name, val) {
  Cache[name] = val;
};


App.cacheExists = function (name, val) {
  return !!Cache[name];
};


App.clearCache = function () {
  _.each(Cache, function (value, key) {
    Cache[key] = null;
  });
};


App.init = function (port) {
  var server = express(config, this);

  this.server = server;

  server.listen(port || server.get('port'), function() {
    console.log("✔ Express server listening on port %d in %s mode", port || server.get('port'), server.get('env'));
  });
};


module.exports = App;


