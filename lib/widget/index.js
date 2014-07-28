
var _ = require('lodash');
var when = require('when');
var path = require('path');
var fs = require('fs');
var WidgetSandbox = require('./sandbox');
var Collections = require('../../collections');
var Root = path.resolve(__dirname, '../../');
var widgetsDir = path.resolve(Root, 'widgets');

var SafeGlobals = ['title', 'description'];
var WidgetCollection = [];
var Templates = {};


exports = module.exports = Widgets;


// Get a relative path to the given apps root, defaults
// to be relative to __dirname
function getWidgetRelativePath(name, relativeTo) {
  relativeTo = relativeTo || __dirname;

  return path.relative(relativeTo, path.join(widgetsDir, name));
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


function getTemplate(widgetName) {
  var templatePath = path.join(widgetsDir, widgetName, 'template.hbs');
  var template = fs.readFileSync(templatePath, 'utf8');

  return template;
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
    // lets sort widgets occupying the same panel
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
    var page = req.path;

    // holds widget objects
    var CurrentWidgetCollection = {};

    // filter and get widgets for only this specific page
    var widgets = WidgetCollection.filter(function (widget) {
      return widget.active && matchPages(widget.pages, page);
    });

    // execute widget request and extract return data
    widgets = widgets.map(function (widget) {
      return widget.exec(App, Collections).then(function (model) {

        var position = model.position;

        // get the template
        model.template = widget.template;
        
        // support for multiple positions
        if(_.isArray(position)) {
          position.forEach(function (pos) {
            if(!_.isArray(CurrentWidgetCollection[pos])) {
              CurrentWidgetCollection[pos] = [];
            }
            CurrentWidgetCollection[pos].push(model);
          });
        }
        else {
          if (!_.isArray(CurrentWidgetCollection[position])) {
            CurrentWidgetCollection[position] = [];
          } 

          CurrentWidgetCollection[position].push(model);         
        }

        return model;
      })
      .otherwise(function (err) {
        console.log(err);
      });
    });
    
    // when all is said and done, continue;
    when.all(widgets).then(function (items) {
      CurrentWidgetCollection = sortWidgets(CurrentWidgetCollection);
      
      // add widgets to templates
      res.locals.WidgetCollection = CurrentWidgetCollection;
      
      next();
    })
    .otherwise(function (error) {
      next(error);
    });
  };
}

