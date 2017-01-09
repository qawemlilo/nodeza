"use strict";

const App = require('widget-cms');
const PostsController = App.getController('Posts');
const auth = require('../lib/auth');


//private
App.get('/admin/blog', auth.isAuthenticated, PostsController.getAdmin);
App.get('/admin/blog/settings', auth.isUserAdmin, PostsController.getSettings);
App.get('/blog/new', auth.isAuthenticated, PostsController.getNew);
App.get('/blog/edit/:id', auth.isAuthenticated, PostsController.getEdit);
App.get('/blog/publish/:id', auth.isAuthenticated, PostsController.getPublish);
App.get('/blog/featured/:id', auth.isAuthenticated, PostsController.isFeatured);
App.get('/blog/delete/:id', auth.isAuthenticated, PostsController.getDelete);
App.post('/blog/new', auth.isAuthenticated, PostsController.postNew);
App.post('/blog/edit', auth.isAuthenticated, PostsController.postEdit);

// public
App.get('/blog', PostsController.getBlog);
App.get('/blog/:slug', PostsController.getPost);
App.get('/blog/category/:slug', PostsController.getBlogCategory);
