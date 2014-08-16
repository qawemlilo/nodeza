var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var config = require('./config/secrets');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');
var widget = require('./lib/widget');

var emitter = new EventEmitter();
var Cache = {};
var Controllers = {};

var models; 
var collections; 
var controllers; 
var routes; 


module.exports = {

  version: pkg.version,


  bookshelf: Bookshelf,


  routesBlacklist: [],

  /*
   * Pseudo express get method
   * 
  **/
  get: function () {
    var args = _.toArray(arguments);

    this.routesBlacklist.push(args[0]);
    this.server.get.apply(this.server, args);
  },


  /*
   * Pseudo express post method
  **/
  post: function () {
    var args = _.toArray(arguments);
    
    this.routesBlacklist.push(args[0]);
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
   * loads application modules
  **/
  loadAppModules: function () {
    models = require('./models');
    collections = require('./collections');
    controllers = require('./controllers');
    routes = require('./routes');

    return {
      models: models,
      collections: collections,
      controllers: controllers,
      routes: routes
    };
  },


  /*
   * sets up route by matching routes to their controllers
  **/
  setupRoutes: function (App, routes, controllers) {
    _.keys(routes).forEach(function (route) {
      // call routes with their corresponding controllers
      routes[route](App, controllers[route]); 
    });
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
   * stores a controller Oject Bookshelf.registry style
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
   * fetches a controller with sll its method names
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
  },


  /*
   * initialize the application
  **/
  init: function (port) {
    var self = this;
    var server;

    // load modules
    var modules = self.loadAppModules();

    // create express server
    server = self.server = express(config);

    // make current user accessible from applicaction object
    server.use(function(req, res, next) {
      if (req.user) self.user = req.user;
      next();
    });

    // Load widgets
    server.use(widget({app: self}));

    // set up routes
    self.setupRoutes(self, modules.routes, modules.controllers);
    
    // start server
    server.listen(port || server.get('port'), function() {
      console.log("✔ Express server listening on port %d in %s mode", port || server.get('port'), server.get('env'));
    });
  }
};


