"use strict";

const App = require('widget-cms');
const UsersController = App.getController('Users');
const MessagesController = App.getController('Messages');
const auth = require('../lib/auth');


App.get('/admin/users', auth.isUserAdmin, UsersController.getUsers);
App.get('/users/new', auth.isUserAdmin, UsersController.getNewUser);
App.get('/users/edit/:id', auth.isUserAdmin, UsersController.getEditUser);
App.post('/users/new', auth.isUserAdmin, UsersController.postUser);
App.post('/users/edit', auth.isUserAdmin, UsersController.postEditUser);
App.get('/users/delete/:id', auth.isAuthenticated, UsersController.getDeleteUser);
App.get('/devs/:slug', auth.isAuthenticated, UsersController.getProfile);
App.get('/devs', auth.isAuthenticated, UsersController.getDevs);
App.get('/admin/messages', auth.isAuthenticated, MessagesController.getConversations);
App.get('/admin/messages/:id', auth.isAuthenticated, MessagesController.getConversation);
App.post('/contact', auth.isAuthenticated, MessagesController.postMessage);
App.post('/contact/all', auth.isUserAdmin, MessagesController.postMessageToAll);
