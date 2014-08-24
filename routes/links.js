"use strict";

var passportConf = require('../config/passport');


module.exports = function (app, LinksController) {

  app.get('/admin/links', passportConf.isUserAdmin, LinksController.getLinks);
  app.get('/links/new', passportConf.isUserAdmin, LinksController.getNewLink);
  app.post('/links/new', passportConf.isUserAdmin, LinksController.postNewLink);
  app.get('/links/edit/:id', passportConf.isUserAdmin, LinksController.getEditLink);
  app.post('/links/edit', passportConf.isUserAdmin, LinksController.postEditLink);
  app.get('/links/delete/:id', passportConf.isUserAdmin, LinksController.getDeleteLink);

};