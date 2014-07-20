

var _ = require('lodash');
var when = require('when');
var path = require('path');
var fs = require('fs');
var WidgetSandbox = require('./sandbox');
var Collections = require('../../collections');


var WidgetCollection = [];
var Root = path.resolve(__dirname, '../../');
var widgetsDir = path.resolve(Root, 'widgets');


var SafeGlobals = ['title', 'description'];


exports = module.exports = Widgets;


// Get the full path to a widget by name
function getWidgetAbsolutePath(name) {
    return path.join(widgetsDir, name);
}


// Get a relative path to the given apps root, defaults
// to be relative to __dirname
function getWidgetRelativePath(name, relativeTo) {
    relativeTo = relativeTo || __dirname;

    return path.relative(relativeTo, getWidgetAbsolutePath(name));
}

// Load apps through a psuedo sandbox
function loadWidget(widgetPath) {
    var sandbox = new WidgetSandbox({parent: module.main});

    return sandbox.loadWidget(widgetPath);
}



function getWidget(name) {
    // Grab the app class to instantiate
    var AppClass = loadWidget(getWidgetRelativePath(name));
    var app;

    // Check for an actual class, otherwise just use whatever was returned
    if (_.isFunction(AppClass)) {
        app = new AppClass();
    } else {
        app = AppClass;
    }

    return app;
}



function matchPaths(urlPath, widgetPath) {

  if (urlPath === widgetPath) {
    return true;
  }

  var urlArr = urlPath.split('/');
  var widgetArr = widgetPath.split('/');
  var isMatch = false;

  if (urlArr.length !== widgetArr.length) {
    return isMatch;
  }

  if (widgetArr[widgetArr.length - 1] === ':any') {
    widgetArr[widgetArr.length - 1] = urlArr[urlArr.length - 1];
  }

  return urlArr.join('') === widgetArr.join('');
}


function matchPages(pages, page) {
  if(pages.length === 0 || pages.indexOf(page) > -1) {
    return true;
  }

  var isMatch = false;

  for (var i = 0; i < pages.length; i++) {
    isMatch = matchPaths(page, pages[i]);
    
    if (isMatch) break;
  }

  return isMatch;
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
      return widget.active && matchPages(widget.pages, page);
    });

    // execute widget request and extract valuable data
    widgets = widgets.map(function (widget) {
      return widget.exec(req, res, Collections).then(function (model) {

        var position = model.position;
        
        // support for multiple positions
        if(_.isArray(position)) {
          position.forEach(function (pos) {
            if(!_.isArray(WidgetCollectionObjects[pos])) {
              WidgetCollectionObjects[pos] = [];
            }
            WidgetCollectionObjects[pos].push(model);
          });
        }
        else {
          if (!_.isArray(WidgetCollectionObjects[position])) {
            WidgetCollectionObjects[position] = [];
          } 

          WidgetCollectionObjects[position].push(model);         
        }
        
        // copy if widget has defined global variables 
        if(_.has(model, 'globals')) {
          _.extend(Globals, _.pick(model.globals, SafeGlobals)); 
        }

        return model;
      })
      .otherwise(function (err) {
        console.log(err);
      });
    });
    
    // when all is said and done, continue;
    when.all(widgets).then(function (items) {
      WidgetCollectionObjects = sortWidgets(WidgetCollectionObjects);
      
      // expose global variables to templates
      _.extend(res.locals, Globals);
      
      // expose widgets to templates
      res.locals.WidgetCollection = WidgetCollectionObjects;
      
      next();
    })
    .otherwise(function (error) {
      next(error);
    });
    
  };
}

