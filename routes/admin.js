"use strict";

/*
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/

var auth = require('../lib/auth');
var exec = require('child_process').exec;


module.exports = function (app, AdminController) {
  app.get('/admin', auth.isAuthenticated, AdminController.getAdmin);
  app.post('/admin/config', auth.isUserAdmin, AdminController.postConfig);
  app.get('/admin/settings', auth.isUserAdmin, AdminController.getGlobalConfig);
  app.get('/admin/settings/server', auth.isUserAdmin, AdminController.getServerConfig);
  app.get('/admin/settings/account', auth.isUserAdmin, AdminController.getAccountConfig);

  app.post('/pull', function (req, res) {
    exec('cd /var/repos/nodeza && git pull', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  });
};
