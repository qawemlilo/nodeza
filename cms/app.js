"use strict";

/*
   Notes:
   Set user model from the onset
*/

const _ = require('lodash');
const bootstrap = require('./bootstrap');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

var Controllers = {};

var emitter = new EventEmitter();

function App() {
  EventEmitter.call(this);
}

util.inherits(App, EventEmitter);

_.extend(App.prototype, {

  init: function (config) {

    // store configuration
    this.config = config;

    // initialize Bookshelf
    let Bookshelf = bootstrap.initBookshelf(config);

    // initialize base model
    Bookshelf = require('./core/model')(Bookshelf);

    // initialize base collection
    Bookshelf = require('./core/collection')(Bookshelf);

    this.Bookshelf = Bookshelf;
    this.Model = Bookshelf.Model;
    this.Collection = Bookshelf.Collection;

    this.initmongoDB = bootstrap.initmongoDB(config.mongodb.url);

    this.server = bootstrap.initServer(config);

    bootstrap.loadModels(config);
    bootstrap.loadCollections(config);

    this.Cache = require('./core/cache');
    this.Controller = require('./core/controller')(this);

    this.Plugins = bootstrap.loadPlugins(config);
    bootstrap.loadControllers(config);

    let widgetMiddleware = bootstrap.initWidgets(this);

    // add widget middleware
    this.server.use(widgetMiddleware);

    //this.Route = require('./core/route')(this);
    bootstrap.loadRoutes(config);

    // start server
    this.server.listen(this.server.get('port'), this.server.get('ipAddress'), () => {
      console.info("✔ Express server listening on port %d in %s mode", this.server.get('port'), this.server.get('env'));
    });
  },

  addCollection: function () {
    let args = Array.prototype.slice.call(arguments);
    return this.Bookshelf.collection.apply(this.Bookshelf, args);
  },


  addModel: function () {
    let args = Array.prototype.slice.call(arguments);
    return this.Bookshelf.model.apply(this.Bookshelf, args);
  },


  controller: function (name, val) {
    this._controllers = this._controllers || Object.create(null);

    if (this._controllers[name]) throw new Error(name + ' is already defined in the registry');

    this._controllers[name] = val;

    return val;
  },


  getController: function (name) {
    if (this._controllers[name]) {
      return new this._controllers[name]();
    }
    else {
      return null;
    }
  },


  getPlugin: function (name) {
    if (this.Plugins[name]) {
      let plugin = this.Plugins[name];

      return plugin;
    }
    else {
      return null;
    }
  },


  getControllers: function () {
    return _.keys(Controllers).map(function (val) {
      return {
        name: val,
        methods: _.keys(Controllers[val])
      };
    });
  },


  getModel: function (name, options) {
    if (!this.Bookshelf._models[name]) {
      throw new Error(`Collection<${name}> not found`);
    }

    return new (this.Bookshelf._models[name])(options);
  },


  getCollection: function (name, options) {
    if (!this.Bookshelf._collections[name]) {
      throw new Error(`Collection<${name}> not found`);
    }

    return new (this.Bookshelf._collections[name])(options);
  },


  getCache: function (name) {
    return this.Cache[name];
  },


  setCache: function (name, val) {
    this.Cache[name] = val;
  },


  cacheExists: function (name) {
    return !!this.Cache[name];
  },


  get: function () {
    let args = _.toArray(arguments);

    this.server.get.apply(this.server, args);
  },


  post: function () {
    let args = _.toArray(arguments);
    this.server.post.apply(this.server, args);
  },


  getConfig: function (name) {
    var blacklist = ['mongodb','mysql','mailgun','github','twitter','google'];
    var safeToSee = _.omit(this.config, blacklist);

    return safeToSee[name];
  },


  updateConfig: function (name, val) {
    if (config[name]) {
      config[name] = val;
    }
  }
});


module.exports = new App;
