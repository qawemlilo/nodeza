

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
var TagsController = require('./controllers/tags');


/**
 * Routes
 */
module.exports.setup = function (app) {
  /* 
   * Home Route
  **/
  app.get('/', HomeController.index);
  

  /* 
   * Account Route
   * passing 'passportConf.isNotAuthenticated' middle to avoid logged in users from viewing some pages
  **/
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
   * External API Routes
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
  // private
  app.get('/account/events', passportConf.isAuthenticated, EventsController.getAdmin);
  app.get('/events/new', passportConf.isAuthenticated, EventsController.getNew);
  app.post('/events/new', passportConf.isAuthenticated, EventsController.postNew);
  app.get('/events/edit/:id', passportConf.isAuthenticated, EventsController.getEdit);
  app.get('/events/delete/:id', passportConf.isAuthenticated, EventsController.getDelete);
  app.post('/events/edit', passportConf.isAuthenticated, EventsController.postEdit);

  // public
  app.get('/events', EventsController.getEvents);
  app.get('/events/city/:city', EventsController.getEventsByCity); 
  app.get('/events/:slug', EventsController.getEvent);
  app.post('/events/limit', EventsController.setLimit);


  /*
   * Companies
  **/
  app.get('/companies', CompaniesController.getCompanies);


  /*
   * Meetups
  **/
  // private
  app.get('/account/meetups', passportConf.isAuthenticated, MeetupsController.getAdmin);
  app.get('/meetups/new', passportConf.isAuthenticated, MeetupsController.getNew);
  app.get('/meetups/edit/:id', passportConf.isAuthenticated, MeetupsController.getEdit);
  app.post('/meetups/new', passportConf.isAuthenticated, MeetupsController.postNew);
  app.post('/meetups/edit', passportConf.isAuthenticated, MeetupsController.postEdit);

  // public
  app.get('/meetups/:slug', MeetupsController.getMeetup);
  app.get('/meetups', MeetupsController.getMeetups);


  /*
   * Blog
  **/
  //private
  app.get('/blog/new', passportConf.isAuthenticated, PostsController.getNew);
  app.get('/blog/edit/:id', passportConf.isAuthenticated, PostsController.getEdit);
  app.get('/blog/publish/:id', passportConf.isAuthenticated, PostsController.getPublish);
  app.get('/blog/delete/:id', passportConf.isAuthenticated, PostsController.getDelete);
  app.get('/account/blog', passportConf.isAuthenticated, PostsController.getAdmin);
  app.post('/blog/new', passportConf.isAuthenticated, PostsController.postNew);
  app.post('/blog/edit', passportConf.isAuthenticated, PostsController.postEdit);
  
  // public
  app.get('/blog', PostsController.getBlog);
  app.get('/blog/:slug', PostsController.getPost);
  app.get('/blog/category/:slug', PostsController.getBlogCategory);
  app.get('/blog/tags/:slug', TagsController.getPosts);  
};
