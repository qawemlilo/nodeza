
var _ = require('lodash');
var when = require('when');
var path = require('path');
var fs = require('fs');
var WidgetSandbox = require('./sandbox');
var Root = path.resolve(__dirname, '../../');
var widgetsDir = path.resolve(Root, 'widgets');
var WidgetCollection = [];


exports = module.exports = Widgets;


// Get a relative path to the given apps root, defaults
// to be relative to __dirname
function getWidgetRelativePath(name, relativeTo) {
  relativeTo = relativeTo || __dirname;

  return path.relative(relativeTo, path.join(widgetsDir, name));
}


// Load apps through a psuedo sandbox
function loadWidget(widgetPath) {
  var sandbox = new WidgetSandbox();

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


function getTemplate(widgetName) {
  var templatePath = path.join(widgetsDir, widgetName, 'template.hbs');

  return fs.readFileSync(templatePath, 'utf8');
}


// loops through the widgets directory and loads widget and templates
function buildWidgets() {
  var currentWidget;

  function build(widgetName) {
    fs.lstat(path.join(widgetsDir, widgetName), function(err, stat) {
      if (stat.isDirectory()) {
        currentWidget = getWidget(widgetName);
        currentWidget.template = getTemplate(widgetName);
        WidgetCollection.push(currentWidget);
      }
    });
  }
  
  // loops through the widgets directory
  fs.readdir(widgetsDir, function(err, widgets) {
    widgets.forEach(build);
  });
}


function matchPaths(urlPath, widgetPath) {

  if (urlPath === widgetPath) {
    return true;
  }

  var urlArr = urlPath.split('/');
  var widgetArr = widgetPath.split('/');
  var isMatch = false;

  if (urlArr.length !== widgetArr.length) {
    return false;
  }

  if (widgetArr[widgetArr.length - 1] === ':any') {
    widgetArr[widgetArr.length - 1] = urlArr[urlArr.length - 1];
  }

  return urlArr.join('') === widgetArr.join('');
}


function matchRoute(routes, page) {
  if (routes.length === 0 || routes.indexOf(page) > -1) {
    return true;
  }

  var isMatch = false, i;

  for (i = 0; i < routes.length; i++) {
    isMatch = matchPaths(page, routes[i]);
    
    if (isMatch) break;
  }

  return isMatch;
}


function sortWidgets (widgetCollection) {
  var widgetPositions = _.keys(widgetCollection);

  _.each(widgetPositions, function (key) {
    widgetCollection[key].sort(function (obj1, obj2) {
      return obj1.order - obj2.order;
    });
  });

  return widgetCollection;
}




function Widgets(opts) {

  opts = opts || {};

  var App = opts.app || {};
   
  // load widgets before any requests can come
  buildWidgets();


  return function (req, res, next) {
    var CurrentWidgetCollection = {}; // holds current widgets

    // filter and get widgets for only this specific page
    var filteredWidgets = WidgetCollection.filter(function (widget) {
      return widget.active && matchRoute(widget.routes, req.path);
    });

    // execute widget request and extract return data
    var widgetOps = filteredWidgets.map(function (widget) {
      return widget.exec(App).then(function (data) {

        var position = data.position;

        // get the template
        data.template = widget.template;
        
        if (!_.isArray(CurrentWidgetCollection[position])) {
          CurrentWidgetCollection[position] = [];
        } 

        CurrentWidgetCollection[position].push(data);         

        return data;
      })
      .otherwise(function (err) {
        req.flash('error', { msg: 'Failed to load widget data' });
      });
    });
    
    // when widgets are loaded, continue
    when.all(widgetOps).then(function () {
      // add widgets to template
      res.locals.WidgetCollection = sortWidgets(CurrentWidgetCollection);
      next();
    })
    .otherwise(function (error) {
      next(error);
    });
  };
}

