"use strict";

/* 
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var passport = require('../config/passport');


module.exports = function (app, AccountController) {

  app.get('/login', passport.isNotAuthenticated, AccountController.getLogin);
  app.post('/login', passport.isNotAuthenticated, AccountController.postLogin);
  app.get('/signup', passport.isNotAuthenticated, AccountController.getSignup);
  app.post('/signup', passport.isNotAuthenticated, AccountController.postSignup);
  app.get('/forgot', passport.isNotAuthenticated, AccountController.getForgot);
  app.post('/forgot', passport.isNotAuthenticated, AccountController.postForgot);
  app.get('/reset/:token', passport.isNotAuthenticated, AccountController.getReset);
  app.post('/reset/:token', passport.isNotAuthenticated, AccountController.postReset);

  app.get('/logout', passport.isAuthenticated, AccountController.logout);
  app.get('/admin/account', passport.isAuthenticated, AccountController.getAccount);
  app.post('/account', passport.isAuthenticated, AccountController.postAccount);
  app.get('/admin/account/password', passport.isAuthenticated, AccountController.getPasswordForm);
  app.get('/admin/account/linked', passport.isAuthenticated, AccountController.getLinkedAccounts);
  app.post('/account/password', passport.isAuthenticated, AccountController.postPassword);
  app.post('/account/delete', passport.isAuthenticated, AccountController.postDeleteAccount);
  app.get('/account/unlink/:provider', passport.isAuthenticated, AccountController.getOauthUnlink);
};