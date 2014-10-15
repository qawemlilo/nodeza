"use strict";

var auth = require('../lib/auth');


module.exports = function (app, LinksController) {
  app.get('/admin/links', auth.isUserAdmin, LinksController.getLinks);
  app.get('/links/new', auth.isUserAdmin, LinksController.getNewLink);
  app.post('/links/new', auth.isUserAdmin, LinksController.postNewLink);
  app.get('/links/edit/:id', auth.isUserAdmin, LinksController.getEditLink);
  app.post('/links/edit', auth.isUserAdmin, LinksController.postEditLink);
  app.get('/links/delete/:id', auth.isUserAdmin, LinksController.getDeleteLink);
};