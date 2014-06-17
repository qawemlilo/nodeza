

var _ = require('lodash');
var when = require('when');
var path = require('path');
var fs = require('fs');
var WidgetSandbox = require('./sandbox');
var Collections = require('../collections');
var widgetObjects = [];
var appRoot = path.resolve(__dirname, '../');
var widgetsDir = path.resolve(appRoot, 'widgets');


exports = module.exports = Widgets;


// Get the full path to an app by name
function getAppAbsolutePath(name) {
    return path.join(widgetsDir, name);
}

// Get a relative path to the given apps root, defaults
// to be relative to __dirname
function getAppRelativePath(name, relativeTo) {
    relativeTo = relativeTo || __dirname;

    return path.relative(relativeTo, getAppAbsolutePath(name));
}


// Load apps through a psuedo sandbox
function loadWidget(widgetPath) {
    var sandbox = new WidgetSandbox({parent: module.main});

    return sandbox.loadWidget(widgetPath);
}



// Get a relative path to the given apps root, defaults
// to be relative to __dirname
function getWidgetRelativePath(absolutePath, relativeTo) {
    relativeTo = relativeTo || __dirname;

    return path.relative(relativeTo, absolutePath);
}


function getWidget(name) {
    // Grab the app class to instantiate
    var AppClass = loadWidget(getAppRelativePath(name));
    var app;

    // Check for an actual class, otherwise just use whatever was returned
    if (_.isFunction(AppClass)) {
        app = new AppClass();
    } else {
        app = AppClass;
    }

    return app;
}


function Widgets() {

  (function compileWidgets() {
    var myWidgets = [];
    var operations = [];

    fs.readdir(widgetsDir, function(err, widgets) {
      widgets.forEach(function (widget) {
      	fs.lstat(path.join(widgetsDir, widget), function(err, stat) {
          if (stat.isDirectory()) {
            widgetObjects.push(getWidget(widget));
          }
        });
      });
    });
  }());



  return function (req, res, next) {
    var page = req.path;

    var widgets = widgetObjects.filter(function (widget) {
      return widget.config.pages.indexOf(page) > -1;
    });


    widgets = widgets.map(function (widget){
      return widget.exec(Collections).then(function (locals) {
        res.locals[widget.config.name] = locals;
        return locals;
      });
    });

    when.all(widgets).then(function (items) {
      next();
    })
    .otherwise(function () {
      next(error);
    });
    
  };
}

