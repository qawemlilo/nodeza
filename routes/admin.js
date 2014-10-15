"use strict";

/* 
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var auth = require('../lib/auth');


module.exports = function (app, AdminController) {
  app.get('/admin', auth.isAuthenticated, AdminController.getAdmin);
  app.post('/admin/config', auth.isUserAdmin, AdminController.postConfig);
  app.get('/admin/settings', auth.isUserAdmin, AdminController.getGlobalConfig);
  app.get('/admin/settings/server', auth.isUserAdmin, AdminController.getServerConfig);
  app.get('/admin/settings/account', auth.isUserAdmin, AdminController.getAccountConfig);
};