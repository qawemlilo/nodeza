

var _ = require('lodash');
var when = require('when');
var path = require('path');
var fs = require('fs');
var WidgetSandbox = require('./sandbox');
var Collections = require('../collections');
var WidgetCollection = [];
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


function sortWidgets (widgetCollection) {
  var widgetPositions = _.keys(widgetCollection);

  widgetPositions.forEach(function (key) {
    // lets sort widgets in the same position
    widgetCollection[key].sort(function (obj1, obj2) {
      return obj1.order - obj2.order;
    });
  });

  return widgetCollection;
}


function Widgets() {

  (function compileWidgets() {
    var myWidgets = [];
    var operations = [];

    fs.readdir(widgetsDir, function(err, widgets) {
      widgets.forEach(function (widget) {
      	fs.lstat(path.join(widgetsDir, widget), function(err, stat) {
          if (stat.isDirectory()) {
            WidgetCollection.push(getWidget(widget));
          }
        });
      });
    });
  }());



  return function (req, res, next) {
    var page = req.path;

    // holds widget objects
    var WidgetCollectionObjects = {};

    // holds template variables;
    var Globals = {};

    // get widgets for only this specific page
    var widgets = WidgetCollection.filter(function (widget) {
      return widget.active && (widget.pages.indexOf(page) > -1 || (widget.pages.length === 0 && page !== '/') || widget.pages === 'all');
    });


    // execute widget request and extract valuable data
    widgets = widgets.map(function (widget) {
      return widget.exec(Collections, req).then(function (model) {

        if(!_.isArray(WidgetCollectionObjects[model.position])) {
          WidgetCollectionObjects[model.position] = [];
        }
        
        // copy if widget has defined global variables 
        if(_.has(model, 'globals')) {
          _.extend(Globals, model.globals); 
        }

        WidgetCollectionObjects[model.position].push(model);

        return model;
      });
    });
    
    // when all is said and done, continue;
    when.all(widgets).then(function (items) {
      WidgetCollectionObjects = sortWidgets(WidgetCollectionObjects);
      
      // expose global variables to templates
      _.extend(res.locals, Globals);
      
      // expose widgets to templates
      res.locals.widgetGlobals = WidgetCollectionObjects;

      //console.log(WidgetCollectionObjects);
      next();
    })
    .otherwise(function () {
      next(error);
    });
    
  };
}

