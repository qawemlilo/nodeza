"use strict";

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var config = require('./config');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');

var emitter = new EventEmitter();
var Cache = {};
var Controllers = {};

var models;
var collections;
var controllers;
var routes;
var widget;


// flag to check if app is already running
var appIsRunning = false;


/*
 * loads application resources
**/
function loadAppModules() {
  models = require('./models');
  collections = require('./collections');
  controllers = require('./controllers');
  routes = require('./routes');
  widget = require('./lib/widget');

  return {
    models: models,
    collections: collections,
    controllers: controllers,
    routes: routes,
    widget: widget
  };
}


/*
 * sets up route by matching routes to their controllers
**/
function setupRoutes(App, routes, controllers) {
  _.keys(routes).forEach(function (route) {
    // call routes with their corresponding controllers
    routes[route](App, controllers[route]);
  });
}




var App = {

  version: pkg.version,


  bookshelf: Bookshelf,


  // before creating a new route in the admin area,
  // we need to check if it already exists
  routesBlacklist: [],


  /*
   * we need to hijack express http methods
   * so we can spy on the routes passed
  **/
  get: function () {
    var args = _.toArray(arguments);
    var routeString = args[0];

    this.routesBlacklist.push(routeString);
    this.server.get.apply(this.server, args);
  },


  /*
   * we need to hijack express http methods
   * so we can spy on the routes passed
  **/
  post: function () {
    var args = _.toArray(arguments);
    var routeString = args[0];

    this.routesBlacklist.push(routeString);
    this.server.post.apply(this.server, args);
  },


  /*
   * Application events handler
  **/
  on: function () {
    emitter.on.apply(this, _.toArray(arguments));
  },


  /*
   * Application event dispatcher
  **/
  emit: function () {
    emitter.emit.apply(this, _.toArray(arguments));
  },


  /*
   * creates routes middleware for checking permissions
  **/
  hasPermission: function (role) {
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
  },


  /*
   * fetches a config property
  **/
  getConfig: function (name) {
    var val = '';
    var blacklist = ['mongodb','mysql','mailgun','github','twitter','google'];
    var safeToSee = _.omit(config, blacklist);
    var user = this.user;

    if (user && user.related('role').get('name') === 'Super Administrator') {
      val = config[name];
    }
    else {
      val = safeToSee[name];
    }

    return val;
  },


  updateConfig: function (name, val) {
    if (config[name]) {
      config[name] = val;
    }
  },


  /*
   * fetches a model
  **/
  getModel: function (name, options) {
    if (Bookshelf._models[name]) {
      return new Bookshelf._models[name](options);
    }
  },


  /*
   * fetches a collection
  **/
  getCollection: function (name, options) {
    if (Bookshelf._collections[name]) {
      return new Bookshelf._collections[name](options);
    }
  },


  /*
   * fetches a controller method
  **/
  getController: function (name, method) {
    if (Controllers[name] && _.isFunction(Controllers[name][method])) {
      return Controllers[name][method];
    }

    return function(){};
  },


  /*
   * fetches a cached item
  **/
  getCache: function (name) {
    return Cache[name];
  },


  /*
   * caches an item
  **/
  setCache: function (name, val) {
    Cache[name] = val;
  },


  /*
   * checks if an item is cached
  **/
  cacheExists: function (name) {
    return !!Cache[name];
  },


  /*
   * stores a controller Object Bookshelf.registry style
  **/
  controller: function (name, val) {
    Controllers[name] = val;

    return val;
  },


  /*
   * checks if a controller and method exists
  **/
  hasController: function (name, method) {
    return !!Controllers[name] && _.isFunction(Controllers[name][method]);
  },


  /*
   * fetches a controller with all its method names
  **/
  getControllers: function () {
    return _.keys(Controllers).map(function (val) {
      return {
        name: val,
        methods: _.keys(Controllers[val])
      };
    });
  },


  /*
   * clears application cache
  **/
  clearCache: function () {
    _.each(Cache, function (value, key) {
      Cache[key] = null;
    });

    console.log('Cache cleared. Process ID: %s', process.pid);
  },


  /*
   * initialize the application
  **/
  init: function (port) {
    // prevent re-initialization of the app
    if (appIsRunning) {
      return false;
    }

    var self = this;
    var server;

    // load modules
    var modules = loadAppModules();

    // create express server
    server = self.server = express(config);

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
    server.use(modules.widget());

    // set up routes
    setupRoutes(self, modules.routes, modules.controllers);

    // start server
    server.listen(port || server.get('port'), server.get('ipAddress'),function() {
      console.log("✔ Express server listening on port %d in %s mode", port || server.get('port'), server.get('env'));

      appIsRunning = true;

    });
  }
};



/*
 * We do not want to expose the whole Application API to
 * the Widget scope so we need to create a limited version
**/
var WidgetAPI = {};

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



module.exports = App;


