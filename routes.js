

var passportConf = require('./config/passport');
var passport = require('passport');


/**
 * Controllers
**/
var AccountController = require('./controllers/account');
var EventsController = require('./controllers/events');
var SiteController = require('./controllers/site');
var CompaniesController = require('./controllers/companies');
var MeetupsController = require('./controllers/meetups');
var PostsController = require('./controllers/posts');
var TagsController = require('./controllers/tags');
var UsersController = require('./controllers/users');
var RolesController = require('./controllers/roles');
var CategoriesController = require('./controllers/categories');
var RoutesController = require('./controllers/routes');
var MenusController = require('./controllers/menus');
var LinksController = require('./controllers/links');

function authCallback(req, res) {
  res.redirect(req.session.returnTo || '/');
}
/**
 * Routes
 */
module.exports.setup = function (app) {
  /* 
   * Site Routes
  **/
  app.get('/', SiteController.index);
  

  /* 
   * Account Routes
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

  app.get('/account/users', passportConf.isUserAdmin, UsersController.getUsers);
  app.get('/users/new', passportConf.isUserAdmin, UsersController.getNewUser);
  app.get('/users/edit/:id', passportConf.isUserAdmin, UsersController.getEditUser);
  app.post('/users/new', passportConf.isUserAdmin, UsersController.postUser);
  app.post('/users/edit', passportConf.isUserAdmin, UsersController.postEditUser);
  app.get('/users/delete/:id', passportConf.isUserAdmin, UsersController.getDeleteUser);

  app.get('/account/users/roles', passportConf.isUserAdmin, RolesController.getRoles);
  app.get('/roles/edit/:id', passportConf.isUserAdmin, RolesController.getEditRole);
  app.post('/roles/edit', passportConf.isUserAdmin, RolesController.postEditRole);
  app.get('/roles/new', passportConf.isUserAdmin, RolesController.getNewRole);
  app.post('/roles/new', passportConf.isUserAdmin, RolesController.postNewRole);
  app.get('/roles/delete/:id', passportConf.isUserAdmin, RolesController.getDeleteRole);

  app.get('/devs/:slug', UsersController.getProfile);


  /* 
   * External API Routes
  **/
  app.get('/auth/github', passport.authenticate('github'), function(req, res, next) {
    if (res.locals.isNewAccount) return res.redirect('/account/password');
    next();
  });
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authCallback);

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), authCallback);

  app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authCallback);


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

  // Super Admin
  app.get('/account/blog/categories', passportConf.isUserAdmin, CategoriesController.getCategories);
  app.get('/category/edit/:id', passportConf.isUserAdmin, CategoriesController.getCategoryEdit);
  app.get('/category/new', passportConf.isUserAdmin, CategoriesController.getNewCategory);
  app.post('/category/edit', passportConf.isUserAdmin, CategoriesController.postEditCategory);
  app.post('/category/new', passportConf.isUserAdmin, CategoriesController.postNewCategory);
  app.get('/category/delete/:id', passportConf.isUserAdmin, CategoriesController.getDeleteCategory);
  
  
  // public
  app.get('/blog', PostsController.getBlog);
  app.get('/blog/:slug', PostsController.getPost);
  app.get('/blog/category/:slug', PostsController.getBlogCategory);
  app.get('/blog/tags/:slug', TagsController.getPosts); 



  app.get('/routes/new', passportConf.isUserAdmin, RoutesController.getNewRoute);
  app.get('/routes/edit/:id', passportConf.isUserAdmin, RoutesController.getEditRoute);
  app.get('/account/routes', passportConf.isUserAdmin, RoutesController.getRoutes);
  app.post('/routes/new', passportConf.isUserAdmin, RoutesController.postNewRoute);
  app.post('/routes/edit', passportConf.isUserAdmin, RoutesController.postEditRoute);
  app.get('/routes/delete/:id', passportConf.isUserAdmin, RoutesController.getDeleteRoute);


  app.get('/account/links', passportConf.isUserAdmin, LinksController.getLinks);
  app.get('/links/new', passportConf.isUserAdmin, LinksController.getNewLink);
  app.post('/links/new', passportConf.isUserAdmin, LinksController.postNewLink);
  app.get('/links/edit/:id', passportConf.isUserAdmin, LinksController.getEditLink);
  app.post('/links/edit', passportConf.isUserAdmin, LinksController.postEditLink);
  app.get('/links/delete/:id', passportConf.isUserAdmin, LinksController.getDeleteLink);


  app.get('/account/menus', passportConf.isUserAdmin, MenusController.getMenus);
  app.get('/menus/new', passportConf.isUserAdmin, MenusController.getNewMenu);
  app.post('/menus/new', passportConf.isUserAdmin, MenusController.postNewMenu);
  app.get('/menus/edit/:id', passportConf.isUserAdmin, MenusController.getMenuEdit);
  app.post('/menus/edit', passportConf.isUserAdmin, MenusController.postEditMenu);
  app.get('/menus/delete/:id', passportConf.isUserAdmin, MenusController.getDeleteMenu);
};