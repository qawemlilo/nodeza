
var path    = require('path');
var Module  = require('module');
var _       = require('lodash');


function WidgetSandbox(opts) {
  this.opts = _.defaults(opts || {}, WidgetSandbox.defaults);
}


WidgetSandbox.prototype.loadWidget = function (widgetPath) {
  var widgetFile = require.resolve(widgetPath);

  this.opts.widgetRoot = path.dirname(widgetFile);

  return this.loadModule(widgetPath);
};


WidgetSandbox.prototype.loadModule = function (widgetPath) {
  // Set loaded modules parent to this
  var self = this;
  var parentModulePath = self.opts.parent || module.parent;
  var widgetRoot = self.opts.widgetRoot;
  var currentModule;
  var nodeRequire;

  // Resolve the modules path
  widgetPath = Module._resolveFilename(widgetPath, parentModulePath);

  // Instantiate a Node Module class
  currentModule = new Module(widgetPath, parentModulePath);

  // Grab the original modules require function
  nodeRequire = currentModule.require;

  // Set a new proxy require function
  currentModule.require = function (module) {

    // check whitelist, plugin config, etc.
    if (!_.contains(self.opts.whitelist, module)) {
      throw new Error("Unsafe App require: %s", module);
    }

    var firstTwo = module.slice(0, 2);
    var resolvedPath;
    var relPath;
    var innerBox;
    var newOpts;

    // Load relative modules with their own sandbox
    if (firstTwo === './' || firstTwo === '..') {

      // Get the path relative to the modules directory
      resolvedPath = path.resolve(widgetRoot, module);

      // Check relative path from the widgetRoot for outside requires
      relPath = path.relative(widgetRoot, resolvedPath);

      if (relPath.slice(0, 2) === '..') {
        throw new Error('Unsafe App require: ' + relPath);
      }

      // Assign as new module path
      module = resolvedPath;

      // Pass down the same options
      newOpts = _.extend({}, self.opts);

      // Make sure the widgetRoot and parent are appropriate
      newOpts.widgetRoot = widgetRoot;
      newOpts.parent = currentModule.parent;

      // Create the inner sandbox for loading this module.
      innerBox = new WidgetSandbox(newOpts);
      
      return innerBox.loadModule(module);
    }

    // Call the original require method for white listed named modules
    return nodeRequire.call(currentModule, module);
  };

  currentModule.load(currentModule.id);

  return currentModule.exports;
};

WidgetSandbox.defaults = {
  whitelist: ["when", "lodash", "./config.json"]
};

module.exports = WidgetSandbox;
