"use strict";

var auth = require('../lib/auth');


module.exports = function (app, MenusController) {
  app.get('/admin/menus', auth.isUserAdmin, MenusController.getMenus);
  app.get('/menus/new', auth.isUserAdmin, MenusController.getNewMenu);
  app.post('/menus/new', auth.isUserAdmin, MenusController.postNewMenu);
  app.get('/menus/edit/:id', auth.isUserAdmin, MenusController.getMenuEdit);
  app.post('/menus/edit', auth.isUserAdmin, MenusController.postEditMenu);
  app.get('/menus/delete/:id', auth.isUserAdmin, MenusController.getDeleteMenu);
};