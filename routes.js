
/*
 *Dependency modules
 */
var passportConf = require('./config/passport');
var passport = require('passport');


/**
 * Controllers
**/
var UserController = require('./controllers/user');
var EventsController = require('./controllers/events');
var PublicController = require('./controllers/public');
var CompaniesController = require('./controllers/companies');
var MeetupsController = require('./controllers/meetups');
var BlogController = require('./controllers/blog');


/**
 * Routes
 */
module.exports.setup = function (app) {
	/* 
	 * Public Routes
	 * passing 'passportConf.isNotAuthenticated' middle to avoid logged in users from viewing some pages
	**/
	app.get('/', PublicController.index);
	app.get('/about', PublicController.about);
	
	app.get('/login', passportConf.isNotAuthenticated, UserController.getLogin);
	app.post('/login', passportConf.isNotAuthenticated, UserController.postLogin);
	app.get('/signup', passportConf.isNotAuthenticated, UserController.getSignup);
	app.post('/signup', passportConf.isNotAuthenticated, UserController.postSignup);
	app.get('/forgot', passportConf.isNotAuthenticated, UserController.getForgot);
  app.post('/forgot', passportConf.isNotAuthenticated, UserController.postForgot);
  app.get('/reset/:token', passportConf.isNotAuthenticated, UserController.getReset);
  app.post('/reset/:token', passportConf.isNotAuthenticated, UserController.postReset);


	/* 
	 * Registered Users Routes
	 * passing 'passportConf.isAuthenticated' middle to avoid public viewing of pages
	**/
	app.get('/logout', passportConf.isAuthenticated, UserController.logout);
	app.get('/account', passportConf.isAuthenticated, UserController.getAccount);
	app.post('/account', passportConf.isAuthenticated, UserController.postAccount);
	app.get('/account/password', passportConf.isAuthenticated, UserController.getPasswordForm);
	app.get('/account/linked', passportConf.isAuthenticated, UserController.getLinkedAccounts);
	app.post('/account/password', passportConf.isAuthenticated, UserController.postPassword);
	app.post('/account/delete', passportConf.isAuthenticated, UserController.postDeleteAccount);
	app.get('/account/unlink/:provider', passportConf.isAuthenticated, UserController.getOauthUnlink);


	/* 
	 * API Routes
	**/
  app.get('/auth/github', passport.authenticate('github'), function(req, res, next) {
    if (req.isNewAccount) return res.redirect('/account/password');
    
    next();
  });
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });


  /*
   * Events
  **/
  app.post('/events/limit', EventsController.setLimit);
  app.get('/events/new', passportConf.isAuthenticated, EventsController.newEvent);
  app.post('/events/new', passportConf.isAuthenticated, EventsController.postNewEvent);
  app.get('/events', EventsController.getEvents);
  app.get('/events/:id', EventsController.getEvent);


  /*
     Companies
  */
  app.get('/companies', CompaniesController.getCompanies);


  /*
     Meetups
  */
  app.get('/meetups', MeetupsController.getMeetups);


  /*
     Blog
  */
  app.get('/blog', BlogController.getBlog);
};
