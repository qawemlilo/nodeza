"use strict";

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var express = require('./server');
var config = require('./config');


var widgetLoader = require('widget-loader');
var widgetDir = path.join(__dirname, './widgets');
var emitter = new EventEmitter();
var Cache = {};
var Controllers = {};


/*
 * loads application resources
**/
function loadAppModules() {
  return {
    models: require('./models'),
    collections: require('./collections'),
    controllers: require('./controllers'),
    routes: require('./routes')
  };
}


/*
 * sets up route by matching routes to their controllers
**/
function setupRoutes(app, routes, controllers) {
  _.keys(routes).forEach(function (route) {
    // call routes with their corresponding controllers
    routes[route](app, controllers[route]);
  });
}


var App = {};

module.exports = App;

global.App = App;

App.running = false;

App.routesBlacklist = [];

App.version = require('./package.json').version;

App.config = require('./config');

App.MongoDB = require('./lib/mongodb-connect')(App.config.mongodb.url);

App.Bookshelf = require('./lib/mysql-connect')(App.config);


App.get = function () {
  var args = _.toArray(arguments);
  var routeString = args[0];

  this.routesBlacklist.push(routeString);
  this.server.get.apply(this.server, args);
};


App.post = function () {
  var args = _.toArray(arguments);
  var routeString = args[0];

  this.routesBlacklist.push(routeString);
  this.server.post.apply(this.server, args);
};


/*
 * Application events handler
**/
App.on = function () {
  emitter.on.apply(this, _.toArray(arguments));
};


/*
 * Application event dispatcher
**/
App.emit = function () {
  emitter.emit.apply(this, _.toArray(arguments));
};


/*
 * creates routes middleware for checking permissions
**/
App.hasPermission = function (role) {
  return function (req, res, next) {
    // if user is logged in and has permission or if no role is defined

    if (!role.get('id')) {
      next();
    }
    else if (req.user.related('role').get('name') === 'Super Administrator') {
      next();
    }
    else if ((req.user && req.user.related('role').get('id') === role.get('id')))  {
      next();
    }
    else {
      req.flash('errors', { msg: 'You are not authorized to view that page' });
      res.redirect('back');
    }
  };
};


/*
 * fetches a config property
**/
App.getConfig = function (name) {
  var val = '';
  var blacklist = ['mongodb','mysql','mailgun','github','twitter','google'];
  var safeToSee = _.omit(App.config, blacklist);
  var user = this.user;

  if (user && user.related('role').get('name') === 'Super Administrator') {
    val = App.config[name];
  }
  else {
    val = safeToSee[name];
  }

  return val;
};


App.updateConfig = function (name, val) {
  if (App.config[name]) {
    App.config[name] = val;
  }
};


/*
 * fetches a model
**/
App.getModel = function (name, options) {
  if (App.Bookshelf._models[name]) {
    return new App.Bookshelf._models[name](options);
  }
};


/*
 * fetches a collection
**/
App.getCollection = function (name, options) {
  if (App.Bookshelf._collections[name]) {
    return new App.Bookshelf._collections[name](options);
  }
};


/*
 * fetches a controller method
**/
App.getController = function (name, method) {
  if (Controllers[name] && _.isFunction(Controllers[name][method])) {
    return Controllers[name][method];
  }

  return function(){};
};


/*
 * fetches a cached item
**/
App.getCache = function (name) {
  return Cache[name];
};


/*
 * caches an item
**/
App.setCache = function (name, val) {
  Cache[name] = val;
};


/*
 * checks if an item is cached
**/
App.cacheExists = function (name) {
  return !!Cache[name];
};


/*
 * stores a controller Object Bookshelf.registry style
**/
App.controller = function (name, val) {
  Controllers[name] = val;

  return val;
};


/*
 * checks if a controller and method exists
**/
App.hasController = function (name, method) {
  return !!Controllers[name] && _.isFunction(Controllers[name][method]);
};


/*
 * fetches a controller with all its method names
**/
App.getControllers = function () {
  return _.keys(Controllers).map(function (val) {
    return {
      name: val,
      methods: _.keys(Controllers[val])
    };
  });
};


/*
 * clears application cache
**/
App.clearCache = function () {
  _.each(Cache, function (value, key) {
    Cache[key] = null;
  });

  console.log('Cache cleared. Process ID: %s', process.pid);
};


/*
 * initialize the application
**/
App.init = function (done) {

  var self = this;
  var server;

  // prevent re-initialization of the app
  if (self.running) {
    return false;
  }

  // load modules
  var modules = loadAppModules();

  // create express server
  server = self.server = express(self.config);

  // make current user accessible from applicaction object
  server.use(function(req, res, next) {
    if (req.user) self.user = req.user;

    if (req.session.clearCache) {
      self.clearCache();
      req.session.clearCache = null;
    }

    next();
  });

  // add widget middleware
  server.use(widgetLoader({
    App: App,
    widgetDir: widgetDir
  }));

  // set up routes
  setupRoutes(self, modules.routes, modules.controllers);

  // start server
  server.listen(server.get('port') || 3000, server.get('ipAddress'),function() {
    console.log("✔ Express server listening on port %d in %s mode", server.get('port') || 3000, server.get('env'));

    self.running = true;
  });
};



/*
 * We do not want to expose the whole Application API to
 * the Widget scope so we need to create a limited version
**/
var WidgetAPI = Object.create({});

WidgetAPI.on = App.on;
WidgetAPI.emit = App.emit;
WidgetAPI.getController = App.getController;
WidgetAPI.getCollection = App.getCollection;
WidgetAPI.getModel = App.getModel;
WidgetAPI.getCache = App.getCache;
WidgetAPI.setCache = App.setCache;
WidgetAPI.getConfig = App.getConfig;
WidgetAPI.setConfig = App.setConfig;
WidgetAPI.cacheExists = App.cacheExists;

App.widgetAPI = function () {
  return WidgetAPI;
};



