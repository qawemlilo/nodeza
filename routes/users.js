

var passportConf = require('../config/passport');


module.exports = function (app, UsersController) {

  app.get('/admin/users', passportConf.isUserAdmin, UsersController.getUsers);
  app.get('/users/new', passportConf.isUserAdmin, UsersController.getNewUser);
  app.get('/users/edit/:id', passportConf.isUserAdmin, UsersController.getEditUser);
  app.post('/users/new', passportConf.isUserAdmin, UsersController.postUser);
  app.post('/users/edit', passportConf.isUserAdmin, UsersController.postEditUser);
  app.get('/users/delete/:id', passportConf.isUserAdmin, UsersController.getDeleteUser);
  app.get('/devs/:slug', UsersController.getProfile);

};