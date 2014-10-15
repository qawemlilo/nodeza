"use strict";

var auth = require('../lib/auth');


module.exports = function (app, UsersController) {
  app.get('/admin/users', auth.isUserAdmin, UsersController.getUsers);
  app.get('/users/new', auth.isUserAdmin, UsersController.getNewUser);
  app.get('/users/edit/:id', auth.isUserAdmin, UsersController.getEditUser);
  app.post('/users/new', auth.isUserAdmin, UsersController.postUser);
  app.post('/users/edit', auth.isUserAdmin, UsersController.postEditUser);
  app.get('/users/delete/:id', auth.isUserAdmin, UsersController.getDeleteUser);
  app.get('/devs/:slug', UsersController.getProfile);
};