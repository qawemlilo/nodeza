"use strict";


const App = require('widget-cms');
const RoutesController = App.getController('Routes');
const auth = require('../lib/auth');


App.get('/admin/routes', auth.isUserAdmin, RoutesController.getRoutes);
App.get('/routes/new', auth.isUserAdmin, RoutesController.getNewRoute);
App.get('/routes/edit/:id', auth.isUserAdmin, RoutesController.getEditRoute);
App.post('/routes/new', auth.isUserAdmin, RoutesController.postNewRoute);
App.post('/routes/edit', auth.isUserAdmin, RoutesController.postEditRoute);
App.get('/routes/delete/:id', auth.isUserAdmin, RoutesController.getDeleteRoute);
