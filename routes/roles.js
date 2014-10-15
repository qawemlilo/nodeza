

var auth = require('../lib/auth');


module.exports = function (app, RolesController) {
  app.get('/admin/users/roles', auth.isUserAdmin, RolesController.getRoles);
  app.get('/roles/edit/:id', auth.isUserAdmin, RolesController.getEditRole);
  app.post('/roles/edit', auth.isUserAdmin, RolesController.postEditRole);
  app.get('/roles/new', auth.isUserAdmin, RolesController.getNewRole);
  app.post('/roles/new', auth.isUserAdmin, RolesController.postNewRole);
  app.get('/roles/delete/:id', auth.isUserAdmin, RolesController.getDeleteRole);
};