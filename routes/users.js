"use strict";

var App = require('widget-cms');
var UsersController = App.getController('Users');


App.get('/admin/users', UsersController.getUsers);
App.get('/users/new', UsersController.getNewUser);
App.get('/users/edit/:id', UsersController.getEditUser);
App.post('/users/new', UsersController.postUser);
App.post('/users/edit', UsersController.postEditUser);
App.get('/users/delete/:id', UsersController.getDeleteUser);
App.get('/devs/:slug', UsersController.getProfile);
App.get('/devs', UsersController.getDevs);
App.get('/devs', UsersController.getDevs);

module.exports = {};
