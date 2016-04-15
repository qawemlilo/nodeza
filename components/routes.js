"use strict";

var Route = require('cms').Route;
var plugins = require('cms').plugins;


Route.get('/admin/users', Route.auth.isUserAdmin, UsersController.getUsers);
Route.get('/users/new', Route.auth.isUserAdmin, UsersController.getNewUser);
Route.get('/users/edit/:id', Route.auth.isUserAdmin, UsersController.getEditUser);
Route.get('/users/delete/:id', plugins.auth.isUserAdmin, UsersController.getDeleteUser);
Route.get('/devs/:slug', plugins.UsersController.getProfile);
Route.get('/devs', UsersController.getDevs);

Route.post('/users/new', Route.isUserAdmin, UsersController.postUser);
Route.post('/users/edit', Route.auth.isUserAdmin, UsersController.postEditUser);
