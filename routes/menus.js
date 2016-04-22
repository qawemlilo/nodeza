"use strict";

const App = require('widget-cms');
const MenusController = App.getController('Menus');
const auth = require('../lib/auth');


App.get('/admin/menus', auth.isUserAdmin, MenusController.getMenus);
App.get('/menus/new', auth.isUserAdmin, MenusController.getNewMenu);
App.post('/menus/new', auth.isUserAdmin, MenusController.postNewMenu);
App.get('/menus/edit/:id', auth.isUserAdmin, MenusController.getMenuEdit);
App.post('/menus/edit', auth.isUserAdmin, MenusController.postEditMenu);
App.get('/menus/delete/:id', auth.isUserAdmin, MenusController.getDeleteMenu);
