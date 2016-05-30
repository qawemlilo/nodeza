"use strict";

const App = require('widget-cms');
const AccountController = App.getController('Account');
const auth = require('../lib/auth');

/*
 * Account Routes
 * passing 'auth.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

App.get('/login', [auth.dontCache, auth.isNotAuthenticated], AccountController.getLogin);
App.get('/loginas/:id', auth.isUserAdmin, AccountController.getLoginAs);
App.get('/restoreadmin', auth.isAuthenticated, AccountController.restoreAdmin);
App.post('/login', auth.dontCache, AccountController.postLogin);

App.get('/signup', auth.isNotAuthenticated, AccountController.getSignup);
App.post('/signup', auth.isNotAuthenticated, AccountController.postSignup);
App.get('/forgot', auth.isNotAuthenticated, AccountController.getForgot);
App.post('/forgot', auth.isNotAuthenticated, AccountController.postForgot);
App.get('/reset/:token', auth.isNotAuthenticated, AccountController.getReset);
App.post('/reset/:token', auth.isNotAuthenticated, AccountController.postReset);

App.get('/logout', auth.isAuthenticated, AccountController.logout);
App.get('/admin/account', auth.isAuthenticated, AccountController.getAccount);
App.post('/account', auth.isAuthenticated, AccountController.postAccount);
App.get('/admin/account/password', auth.isAuthenticated, AccountController.getPasswordForm);
App.get('/admin/account/linked', auth.isAuthenticated, AccountController.getLinkedAccounts);
App.post('/account/password', auth.isAuthenticated, AccountController.postPassword);
App.post('/account/delete', auth.isAuthenticated, AccountController.postDeleteAccount);
App.get('/account/unlink/:provider', auth.isAuthenticated, AccountController.getOauthUnlink);
