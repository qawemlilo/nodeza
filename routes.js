
/*
 *Dependency modules
**/
var passportConf = require('./config/passport');
var passport = require('passport');


/**
 * Controllers
**/
var AccountController = require('./controllers/account');
var EventsController = require('./controllers/events');
var HomeController = require('./controllers/home');
var CompaniesController = require('./controllers/companies');
var MeetupsController = require('./controllers/meetups');
var PostsController = require('./controllers/posts');


/**
 * Routes
 */
module.exports.setup = function (app) {
	/* 
	 * Home Route
	 * passing 'passportConf.isNotAuthenticated' middle to avoid logged in users from viewing some pages
	**/
	app.get('/', HomeController.index);
	
	app.get('/login', passportConf.isNotAuthenticated, AccountController.getLogin);
	app.post('/login', passportConf.isNotAuthenticated, AccountController.postLogin);
	app.get('/signup', passportConf.isNotAuthenticated, AccountController.getSignup);
	app.post('/signup', passportConf.isNotAuthenticated, AccountController.postSignup);
	app.get('/forgot', passportConf.isNotAuthenticated, AccountController.getForgot);
  app.post('/forgot', passportConf.isNotAuthenticated, AccountController.postForgot);
  app.get('/reset/:token', passportConf.isNotAuthenticated, AccountController.getReset);
  app.post('/reset/:token', passportConf.isNotAuthenticated, AccountController.postReset);


	/* 
	 * Registered Users Routes
	 * passing 'passportConf.isAuthenticated' middle to avoid public viewing of pages
	**/
	app.get('/logout', passportConf.isAuthenticated, AccountController.logout);
	app.get('/account', passportConf.isAuthenticated, AccountController.getAccount);
	app.post('/account', passportConf.isAuthenticated, AccountController.postAccount);
	app.get('/account/password', passportConf.isAuthenticated, AccountController.getPasswordForm);
	app.get('/account/linked', passportConf.isAuthenticated, AccountController.getLinkedAccounts);
	app.post('/account/password', passportConf.isAuthenticated, AccountController.postPassword);
	app.post('/account/delete', passportConf.isAuthenticated, AccountController.postDeleteAccount);
	app.get('/account/unlink/:provider', passportConf.isAuthenticated, AccountController.getOauthUnlink);

  app.get('/devs/:slug', AccountController.getUser);


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

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

  app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });


  /*
   * Events
  **/
  app.post('/events/limit', EventsController.setLimit);
  app.get('/admin/events', passportConf.isAuthenticated, EventsController.getEventsAdmin);
  app.get('/admin/events/new', passportConf.isAuthenticated, EventsController.newEvent);
  app.post('/admin/events/new', passportConf.isAuthenticated, EventsController.postNewEvent);
  app.get('/events', EventsController.getEvents);
  app.get('/events/:slug', EventsController.getEvent);


  /*
   * Companies
  **/
  app.get('/companies', CompaniesController.getCompanies);


  /*
   *Meetups
  **/
  app.get('/admin/meetups', passportConf.isAuthenticated, MeetupsController.getMeetupsAdmin);
  app.get('/admin/meetups/new', passportConf.isAuthenticated, MeetupsController.newMeetup);
  app.post('/admin/meetups/new', passportConf.isAuthenticated, MeetupsController.postMeetup);
  app.post('/admin/meetups/edit', passportConf.isAuthenticated, MeetupsController.postMeetup);
  app.get('/meetups', MeetupsController.getMeetups);
  app.get('/meetups/edit/:id', passportConf.isAuthenticated, MeetupsController.getMeetupEdit);
  app.get('/meetups/:slug', MeetupsController.getMeetup);
  app.get('/meetups', MeetupsController.getMeetups);


  /*
   * Blog
  **/
  app.get('/blog', PostsController.getPosts);
  app.get('/blog/:slug', PostsController.getPost);
  app.get('/blog/category/:slug', PostsController.getPostsByCategory);
  app.get('/admin/blog', passportConf.isAuthenticated, PostsController.newPostsAdmin);
  app.get('/admin/blog/new', passportConf.isAuthenticated, PostsController.newPost);
  app.post('/admin/blog/new', passportConf.isAuthenticated, PostsController.postPost);
  app.post('/blog/edit', passportConf.isAuthenticated, PostsController.postEdit);
  app.get('/blog/edit/:id', passportConf.isAuthenticated, PostsController.getEdit);
  app.get('/blog/delete/:id', passportConf.isAuthenticated, PostsController.getDelete);
  app.get('/blog/publish/:id', passportConf.isAuthenticated, PostsController.getPublish);
};
