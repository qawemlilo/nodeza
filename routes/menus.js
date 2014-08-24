"use strict";

var passportConf = require('../config/passport');


module.exports = function (app, MenusController) {

  app.get('/admin/menus', passportConf.isUserAdmin, MenusController.getMenus);
  app.get('/menus/new', passportConf.isUserAdmin, MenusController.getNewMenu);
  app.post('/menus/new', passportConf.isUserAdmin, MenusController.postNewMenu);
  app.get('/menus/edit/:id', passportConf.isUserAdmin, MenusController.getMenuEdit);
  app.post('/menus/edit', passportConf.isUserAdmin, MenusController.postEditMenu);
  app.get('/menus/delete/:id', passportConf.isUserAdmin, MenusController.getDeleteMenu);
};