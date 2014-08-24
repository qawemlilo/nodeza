"use strict";

/* 
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var passport = require('../config/passport');


module.exports = function (app, AdminController) {

  app.get('/admin', passport.isAuthenticated, AdminController.getAdmin);
  app.post('/admin/config', passport.isUserAdmin, AdminController.postConfig);
  app.get('/admin/settings', passport.isUserAdmin, AdminController.getGlobalConfig);
  app.get('/admin/settings/server', passport.isUserAdmin, AdminController.getServerConfig);
  app.get('/admin/settings/account', passport.isUserAdmin, AdminController.getAccountConfig);
};