"use strict";

var passportConf = require('../config/passport');


module.exports = function (app, CategoriesController) {

  // Super Admin
  app.get('/admin/blog/categories', passportConf.isUserAdmin, CategoriesController.getCategories);
  app.get('/category/edit/:id', passportConf.isUserAdmin, CategoriesController.getCategoryEdit);
  app.get('/category/new', passportConf.isUserAdmin, CategoriesController.getNewCategory);
  app.post('/category/edit', passportConf.isUserAdmin, CategoriesController.postEditCategory);
  app.post('/category/new', passportConf.isUserAdmin, CategoriesController.postNewCategory);
  app.get('/category/delete/:id', passportConf.isUserAdmin, CategoriesController.getDeleteCategory);

};