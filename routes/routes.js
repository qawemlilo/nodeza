"use strict";

var auth = require('../lib/auth');


module.exports = function (app, RoutesController) {
  app.get('/admin/routes', auth.isUserAdmin, RoutesController.getRoutes);
  app.get('/routes/new', auth.isUserAdmin, RoutesController.getNewRoute);
  app.get('/routes/edit/:id', auth.isUserAdmin, RoutesController.getEditRoute);
  app.post('/routes/new', auth.isUserAdmin, RoutesController.postNewRoute);
  app.post('/routes/edit', auth.isUserAdmin, RoutesController.postEditRoute);
  app.get('/routes/delete/:id', auth.isUserAdmin, RoutesController.getDeleteRoute);
};