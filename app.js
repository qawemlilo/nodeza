var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var config = require('./config/secrets');
var Bookshelf = require('./dbconnect')(config);
var express = require('./server');

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
    var models = path.join(__dirname, 'models');
    var collections = path.join(__dirname, 'collections');

    // loops through the widgets directory
    fs.readdir(models, function(err, files) {
      files.forEach(function (filename) {
        fs.lstat(path.join(models, filename), function(err, stat) {
          if (stat.isFile()) {
            require('./models/' + filename);
          }
        });
      });
    });
  
    // loops through the widgets directory
    fs.readdir(collections, function(err, files) {
      files.forEach(function (filename) {
        fs.lstat(path.join(collections, filename), function(err, stat) {
          if (stat.isFile()) {
            require('./collections/' + filename);
          }
        });
      });
    });
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


  buildRoutes: function () {
    var self = this;
    var routes = self.getCollection('Routes');
    var app = self.server;

    routes.fetch({withRelated: ['role']})
    .then(function (collection) {
      collection.forEach(function (route) {
        var role = route.related('role');
        var name = route.get('controller_name');
        var method = route.get('controller_method');
        var url = route.get('path');

        app.use(url, self.hasPermission(role), Controllers[name][method]);
      });
    })
    .otherwise(function (error) {
      throw error;     
    });
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

    self.loadAppModules();
    self.server = express(config, self);

    require('./routes').setup(self.server);
    self.buildRoutes();
  
    self.server.listen(port || self.server.get('port'), function() {
      console.log("✔ Express server listening on port %d in %s mode", port || self.server.get('port'), self.server.get('env'));
    });
  }
};


module.exports = App;


