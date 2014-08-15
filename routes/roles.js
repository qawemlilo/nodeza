

var passportConf = require('../config/passport');


module.exports = function (app, RolesController) {

  app.get('/admin/users/roles', passportConf.isUserAdmin, RolesController.getRoles);
  app.get('/roles/edit/:id', passportConf.isUserAdmin, RolesController.getEditRole);
  app.post('/roles/edit', passportConf.isUserAdmin, RolesController.postEditRole);
  app.get('/roles/new', passportConf.isUserAdmin, RolesController.getNewRole);
  app.post('/roles/new', passportConf.isUserAdmin, RolesController.postNewRole);
  app.get('/roles/delete/:id', passportConf.isUserAdmin, RolesController.getDeleteRole);

};