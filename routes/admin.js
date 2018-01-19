"use strict";

/*
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/
const App = require('widget-cms');
const AdminController = App.getController('Admin');
const auth = require('../lib/auth');


App.get('/admin', auth.isAuthenticated, AdminController.getAdmin);
App.post('/admin/config', auth.isUserAdmin, AdminController.postConfig);
App.get('/admin/settings', auth.isUserAdmin, AdminController.getGlobalConfig);
App.get('/admin/settings/account', auth.isUserAdmin, AdminController.getAccountConfig);
