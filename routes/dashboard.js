"use strict";

/*
 * Account Routes
 * passing 'passport.isNotAuthenticated' middle to avoid logged in users from viewing some pages
**/
const App = require('widget-cms');
const DashboardController = App.getController('Dashboard');
const auth = require('../lib/auth');


App.get('/dashboard', auth.isAuthenticated, DashboardController.getDashboard);
App.get('/dashboard/posts/new', auth.isAuthenticated, DashboardController.getNewPost);
App.get('/dashboard/posts', auth.isAuthenticated, DashboardController.getPosts);
App.get('/dashboard/posts/edit/:id', auth.isAuthenticated, DashboardController.getEditPost);
App.post('/dashboard/posts/new', auth.isAuthenticated, DashboardController.createPost);
App.post('/dashboard/posts/edit', auth.isAuthenticated, DashboardController.editPost);
App.get('/dashboard/settings/account', auth.isAuthenticated, DashboardController.getAccount);
App.post('/dashboard/settings/account', auth.isAuthenticated, DashboardController.postAccount);
