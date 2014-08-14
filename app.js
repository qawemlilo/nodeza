var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var config = require('./config/secrets');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');
var when = require('when');

var emitter = new EventEmitter();
var Cache = {};
var Controllers = {};


var App = {

  version: pkg.version,


  bookshelf: Bookshelf,


  on: function () {
    emitter.on.apply(this, _.toArray(arguments));
  },


  emit: function () {
    emitter.emit.apply(this, _.toArray(arguments));
  },


  loadAppModules: function () {
    require('./models');
    require('./collections');
    require('./controllers');
  },


  hasPermission: function (role) {
    return function (req, res, next) {
      // if user is logged in and has permission or if no role is defined
      if ((req.user && req.user.related('role').get('id') === role.get('id')) || !role.get('id'))  {
        next();
      } else {
        req.flash('errors', { msg: 'You are not authorized to view that page' });
        res.redirect('back');
      }
    };
  },


  getModel: function (name, options) {
    if (Bookshelf._models[name]) {
      return new Bookshelf._models[name](options);
    }
  },


  getCollection: function (name, options) {
    if (Bookshelf._collections[name]) {
      return new Bookshelf._collections[name](options);
    }
  },


  getController: function (name, method) {
    if (Controllers[name] && _.isFunction(Controllers[name][method])) {
      return Controllers[name][method];
    }

    return function(){};
  },


  getCache: function (name) {
    return Cache[name];
  },


  setCache: function (name, val) {
    Cache[name] = val;
  },


  cacheExists: function (name) {
    return !!Cache[name];
  },


  controller: function (name, val) {
    Controllers[name] = val;

    return val;
  },


  testController: function (name, method) {
    return !!Controllers[name] && _.isFunction(Controllers[name][method]);
  },


  getControllers: function () {
    return _.keys(Controllers).map(function (val) {
      return {
        name: val, 
        methods: _.keys(Controllers[val])
      };
    });
  },


  clearCache: function () {
    _.each(Cache, function (value, key) {
      Cache[key] = null;
    });
  },


  init: function (port) {
    var self = this;
    var server;

    self.loadAppModules();
    server = express(config, self);
  
    server.listen(port || server.get('port'), function() {
      console.log("✔ Express server listening on port %d in %s mode", port || server.get('port'), server.get('env'));
    });
  }
};


module.exports = App;


