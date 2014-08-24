"use strict";

var passportConf = require('../config/passport');


module.exports = function (app, PostsController) {

  //private
  app.get('/admin/blog', passportConf.isAuthenticated, PostsController.getAdmin);
  app.get('/admin/blog/settings', passportConf.isUserAdmin, PostsController.getSettings);
  app.get('/blog/new', passportConf.isAuthenticated, PostsController.getNew);
  app.get('/blog/edit/:id', passportConf.isAuthenticated, PostsController.getEdit);
  app.get('/blog/publish/:id', passportConf.isAuthenticated, PostsController.getPublish);
  app.get('/blog/delete/:id', passportConf.isAuthenticated, PostsController.getDelete);
  app.post('/blog/new', passportConf.isAuthenticated, PostsController.postNew);
  app.post('/blog/edit', passportConf.isAuthenticated, PostsController.postEdit);
  
  // public
  app.get('/blog', PostsController.getBlog);
  app.get('/blog/:slug', PostsController.getPost);
  app.get('/blog/category/:slug', PostsController.getBlogCategory);

};