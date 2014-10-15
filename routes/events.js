"use strict";

var auth = require('../lib/auth');


module.exports = function (app, EventsController) {
  // private
  app.get('/admin/events', auth.isAuthenticated, EventsController.getAdmin);
  app.get('/events/new', auth.isAuthenticated, EventsController.getNew);
  app.post('/events/new', auth.isAuthenticated, EventsController.postNew);
  app.get('/events/edit/:id', auth.isAuthenticated, EventsController.getEdit);
  app.get('/events/delete/:id', auth.isAuthenticated, EventsController.getDelete);
  app.post('/events/edit', auth.isAuthenticated, EventsController.postEdit);

  // public
  app.get('/events', EventsController.getEvents);
  app.get('/events/city/:city', EventsController.getEventsByCity); 
  app.get('/events/:slug', EventsController.getEvent);
  app.post('/events/limit', EventsController.setLimit);
  app.post('/events/history', EventsController.setHistory);
};