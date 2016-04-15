"use strict";

var path = require('path');
var fs = require('fs');
var widgetLoader = require('widget-loader');
var Bootstrap = {};


Bootstrap.initBookshelf = function (config) {
  console.log("✔ Initializing bookshelf...");

  return require('./core/bookshelf')(config);
};


Bootstrap.initmongoDB = function (url) {
  console.log("✔ Initializing MongoDB...");

  return require('./core/mongodb')(url);
};


Bootstrap.initServer = function (config) {
    console.log("✔ Initializing server...");

    return require('./server')(config);
};


Bootstrap.initWidgets = function (App) {
    console.log("✔ Initializing widgets...");
    return widgetLoader(App, {
      widgetDirectory: path.join(App.config.rootDir, 'widgets')
    });
};


Bootstrap.loadModels = function (config) {
  console.log("✔ Loading widgets...");

  let modelsDir = path.join(config.rootDir, 'models');

  fs.existsSync(modelsDir) && fs.readdirSync(modelsDir).forEach( (m) => {
    require(`${modelsDir}/${m}`);
  });
};


Bootstrap.loadRoutes = function (app) {
  console.log("✔ Loading widgets...");
  let modelsDir = path.join(config.rootDir, 'routes');

  fs.existsSync(modelsDir) && fs.readdirSync(modelsDir).forEach( (m) => {
    require(`${modelsDir}/${m}`);
  });
};


Bootstrap.loadCollections = function (config) {
  console.log("✔ Loading collections...");
  let collectionsDir = path.join(config.rootDir, 'collections');

  fs.existsSync(collectionsDir) && fs.readdirSync(collectionsDir).forEach( (m) => {
    require(`${collectionsDir}/${m}`);
  });
};


Bootstrap.loadControllers = function (config) {
  console.log("✔ Loading controllers...");
  let modelsDir = path.join(config.rootDir, 'controllers');

  fs.existsSync(modelsDir) && fs.readdirSync(modelsDir).forEach( (m) => {
    require(`${modelsDir}/${m}`);
  });
};


Bootstrap.loadRoutes = function (config) {
  console.log("✔ Loading routes...");

  let modelsDir = path.join(config.rootDir, 'routes');

  fs.existsSync(modelsDir) && fs.readdirSync(modelsDir).forEach( (m) => {
    require(`${modelsDir}/${m}`);
  });
};


module.exports = Bootstrap;
