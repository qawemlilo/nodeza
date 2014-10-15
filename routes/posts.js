"use strict";

var auth = require('../lib/auth');


module.exports = function (app, PostsController) {
  //private
  app.get('/admin/blog', auth.isAuthenticated, PostsController.getAdmin);
  app.get('/admin/blog/settings', auth.isUserAdmin, PostsController.getSettings);
  app.get('/blog/new', auth.isAuthenticated, PostsController.getNew);
  app.get('/blog/edit/:id', auth.isAuthenticated, PostsController.getEdit);
  app.get('/blog/publish/:id', auth.isAuthenticated, PostsController.getPublish);
  app.get('/blog/delete/:id', auth.isAuthenticated, PostsController.getDelete);
  app.post('/blog/new', auth.isAuthenticated, PostsController.postNew);
  app.post('/blog/edit', auth.isAuthenticated, PostsController.postEdit);
  
  // public
  app.get('/blog', PostsController.getBlog);
  app.get('/blog/:slug', PostsController.getPost);
  app.get('/blog/category/:slug', PostsController.getBlogCategory);
};