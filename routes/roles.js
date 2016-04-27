

const App = require('widget-cms');
const RolesController = App.getController('Roles');
const auth = require('../lib/auth');


App.get('/admin/users/roles', auth.isUserAdmin, RolesController.getRoles);
App.get('/roles/edit/:id', auth.isUserAdmin, RolesController.getEditRole);
App.post('/roles/edit', auth.isUserAdmin, RolesController.postEditRole);
App.get('/roles/new', auth.isUserAdmin, RolesController.getNewRole);
App.post('/roles/new', auth.isUserAdmin, RolesController.postNewRole);
App.get('/roles/delete/:id', auth.isUserAdmin, RolesController.getDeleteRole);
