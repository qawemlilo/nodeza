"use strict";


let utils = require('../lib/utils');
let controllerInstance = null;


module.exports = function (app) {

  if (controllerInstance) {
    return controllerInstance;
  }

  let Controller = function () {
    this.initialize.apply(this, Array.prototype.slice.call(arguments));
  };

  Controller.prototype.initialize = function () {};

  Controller.prototype.getModel = function () {
    let args = Array.prototype.slice.call(arguments);
    return app.Bookshelf.model.apply(app.Bookshelf, args);
  };

  Controller.prototype.getCollection = function () {
    let args = Array.prototype.slice.call(arguments);
    return app.Bookshelf.collection.apply(app.Bookshelf, args);
  };

  Controller.extend = utils.extend;
  Controller.App = app;

  controllerInstance = Controller;

  return controllerInstance
};
