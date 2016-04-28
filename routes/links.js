"use strict";

const App = require('widget-cms');
const LinksController = App.getController('Links');
const auth = require('../lib/auth');


App.get('/admin/links', auth.isUserAdmin, LinksController.getLinks);
App.get('/links/new', auth.isUserAdmin, LinksController.getNewLink);
App.post('/links/new', auth.isUserAdmin, LinksController.postNewLink);
App.get('/links/edit/:id', auth.isUserAdmin, LinksController.getEditLink);
App.post('/links/edit', auth.isUserAdmin, LinksController.postEditLink);
App.get('/links/delete/:id', auth.isUserAdmin, LinksController.getDeleteLink);
