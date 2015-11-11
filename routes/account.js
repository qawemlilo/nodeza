"use strict";

/*
 * Account Routes
 * passing 'auth.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var auth = require('../lib/auth');


module.exports = function (app, AccountController) {
  app.get('/login', auth.isNotAuthenticated, AccountController.getLogin);
  app.get('/loginas/:id', auth.isUserAdmin, AccountController.getLoginAs);
  app.get('/restoreadmin', auth.isAuthenticated, AccountController.restoreAdmin);
  app.post('/login', auth.isNotAuthenticated, AccountController.postLogin);
  app.get('/signup', auth.isNotAuthenticated, AccountController.getSignup);
  app.post('/signup', auth.isNotAuthenticated, AccountController.postSignup);
  app.get('/forgot', auth.isNotAuthenticated, AccountController.getForgot);
  app.post('/forgot', auth.isNotAuthenticated, AccountController.postForgot);
  app.get('/reset/:token', auth.isNotAuthenticated, AccountController.getReset);
  app.post('/reset/:token', auth.isNotAuthenticated, AccountController.postReset);

  app.get('/logout', auth.isAuthenticated, AccountController.logout);
  app.get('/admin/account', auth.isAuthenticated, AccountController.getAccount);
  app.post('/account', auth.isAuthenticated, AccountController.postAccount);
  app.get('/admin/account/password', auth.isAuthenticated, AccountController.getPasswordForm);
  app.get('/admin/account/linked', auth.isAuthenticated, AccountController.getLinkedAccounts);
  app.post('/account/password', auth.isAuthenticated, AccountController.postPassword);
  app.post('/account/delete', auth.isAuthenticated, AccountController.postDeleteAccount);
  app.get('/account/unlink/:provider', auth.isAuthenticated, AccountController.getOauthUnlink);
};
