

var _ = require('lodash');
var routes = require('./routes');
var controllers = require('./controllers');


module.exports.setup = function (app) {
  _.keys(routes).forEach(function (route) {
    // call routes with their corresponding controllers
    routes[route](app, controllers[route]); 
  });
};


