

var passportConf = require('../config/passport');


module.exports = function (app, RoutesController) {

  app.get('/admin/routes', passportConf.isUserAdmin, RoutesController.getRoutes);
  app.get('/routes/new', passportConf.isUserAdmin, RoutesController.getNewRoute);
  app.get('/routes/edit/:id', passportConf.isUserAdmin, RoutesController.getEditRoute);
  app.post('/routes/new', passportConf.isUserAdmin, RoutesController.postNewRoute);
  app.post('/routes/edit', passportConf.isUserAdmin, RoutesController.postEditRoute);
  app.get('/routes/delete/:id', passportConf.isUserAdmin, RoutesController.getDeleteRoute);

};