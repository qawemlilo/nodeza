
/* 
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var passport = require('../config/passport');


module.exports = function (app, AdminController) {

  app.get('/admin', passport.isAuthenticated, AdminController.getAdmin);
  app.post('/admin/config', passport.isAuthenticated, AdminController.postConfig);
  app.get('/admin/settings', passport.isAuthenticated, AdminController.getGlobalConfig);
  app.get('/admin/settings/server', passport.isAuthenticated, AdminController.getServerConfig);
};