

var passportConf = require('./config/passport');
var passport = require('passport');



function authCallback(req, res) {
  res.redirect(req.session.returnTo || '/');
}


/*
 * This function returns an express route middleware 
 * It validates if the user is authorised to access a route
 *
 * @params: {Model}role - Bookshelf model containing user role data
**/
function hasPermission(role) {
  return function (req, res, next) {
    var user = req.user;

    // if route has no restrictions set
    if (!role.get('id')) {
      next();
    }
    // if user has authorised access
    else if (user && user.related('role').get('id') === role.get('id')) {
      next();
    }
    // if super admin
    else if (user.related('role').get('name') === 'Super Administrator') {
      next();
    }
    // otherwise don't give access
    else {
      req.flash('errors', { msg: 'You are not authorized to view that page' });
      res.redirect('back');
    }
  };
}



/*
 * This function loads routes dynamically. 
 * The idea is to create and manage all your routes and menu items
 * throght the admin interface. This function then pulls and loads all the routes
 * with their associated permissions and controllers.
 *
 * @params: {Object}App - Global application object
 * @params: {Object}App - express server object
**/
function buildRoutes(App,  Server) {
  var routes = App.getCollection('Routes');

  console.log('buildRoutes called');
  
  return routes.fetch({withRelated: ['role']})
  .then(function (collection) {
    collection.forEach(function (route) {
      var role = route.related('role');
      var name = route.get('controller_name');
      var method = route.get('controller_method');
      var httpMethod = route.get('http_method');
      var url = route.get('path');

      name = name.trim();
      method = method.trim();
      url = url.trim();
      httpMethod = httpMethod.toLowerCase().trim();

      var controllerMethod = App.getController(name, method);

      App.server[httpMethod](url, hasPermission(role), controllerMethod);
    });
  })
  .otherwise(function (error) {
    throw error;  
  });
}




/**
 *  Routes setup method
 */
module.exports.setup = function (App, Server) {
  /* 
   * External API Routes
  **/
  Server.get('/auth/github', passport.authenticate('github'), function(req, res, next) {
    if (res.locals.isNewAccount) {
      return res.redirect('/account/password');
    }
    next();
  });
  Server.get('/auth/github/callback', passport.authenticate('github', {failureRedirect:'/login'}), authCallback);
  Server.get('/auth/twitter', passport.authenticate('twitter'));
  Server.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect:'/login'}), authCallback);
  Server.get('/auth/google', passport.authenticate('google', {scope:'profile email'}));
  Server.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/login'}), authCallback);

  
  buildRoutes(App, Server);
};