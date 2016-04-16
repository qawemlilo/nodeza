"use strict";


const _ = require('lodash');
let utils = require('../lib/utils');
let controllerInstance = null;


module.exports = function (app) {

  if (controllerInstance) {
    return controllerInstance;
  }

  function Controller() {
    this.initialize.apply(this, arguments);
  };

  _.extend(Controller.prototype, {
    initialize: function () {},

    getModel: function () {
      let args = Array.prototype.slice.call(arguments);
      return app.Bookshelf.model.apply(app.Bookshelf, args);
    },

    getCollection: function () {
      let args = Array.prototype.slice.call(arguments);
      return app.Bookshelf.collection.apply(app.Bookshelf, args);
    }
  });

  Controller.extend = utils.extend;

  controllerInstance = Controller;

  return Controller
};
