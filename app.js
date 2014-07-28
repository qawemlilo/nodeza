


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var pkg = require('./package.json');
var config = require('./config/secrets');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');


var emitter = new EventEmitter();


module.exports.bookshelf = Bookshelf;


module.exports.version = pkg.version;


module.exports.on = function () {
  emitter.on.apply(this, _.toArray(arguments));
};


module.exports.emit = function () {
  emitter.emit.apply(this, _.toArray(arguments));
};


module.exports.init = function (port) {
  var server = express(config, module.exports);

  module.exports.server = server;

  server.listen(port || server.get('port'), function() {
    console.log("✔ Express server listening on port %d in %s mode", port || server.get('port'), server.get('env'));
  });
};


