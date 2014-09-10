"use strict";

var passportConf = require('../config/passport');


module.exports = function (app, EventsController) {
  // private
  app.get('/admin/events', passportConf.isAuthenticated, EventsController.getAdmin);
  app.get('/events/new', passportConf.isAuthenticated, EventsController.getNew);
  app.post('/events/new', passportConf.isAuthenticated, EventsController.postNew);
  app.get('/events/edit/:id', passportConf.isAuthenticated, EventsController.getEdit);
  app.get('/events/delete/:id', passportConf.isAuthenticated, EventsController.getDelete);
  app.post('/events/edit', passportConf.isAuthenticated, EventsController.postEdit);

  // public
  app.get('/events', EventsController.getEvents);
  app.get('/events/city/:city', EventsController.getEventsByCity); 
  app.get('/events/:slug', EventsController.getEvent);
  app.post('/events/limit', EventsController.setLimit);
  app.post('/events/history', EventsController.setHistory);
};