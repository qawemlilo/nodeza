"use strict";

var auth = require('../lib/auth');


module.exports = function (app, CategoriesController) {
  // Super Admin
  app.get('/admin/blog/categories', auth.isUserAdmin, CategoriesController.getCategories);
  app.get('/category/edit/:id', auth.isUserAdmin, CategoriesController.getCategoryEdit);
  app.get('/category/new', auth.isUserAdmin, CategoriesController.getNewCategory);
  app.post('/category/edit', auth.isUserAdmin, CategoriesController.postEditCategory);
  app.post('/category/new', auth.isUserAdmin, CategoriesController.postNewCategory);
  app.get('/category/delete/:id', auth.isUserAdmin, CategoriesController.getDeleteCategory);

};