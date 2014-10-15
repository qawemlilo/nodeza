"use strict";

var auth = require('../lib/auth');


module.exports = function (app, MeetupsController) {
  // private
  app.get('/admin/meetups', auth.isAuthenticated, MeetupsController.getAdmin);
  app.get('/admin/meetups/settings', auth.isUserAdmin, MeetupsController.getSettings);
  app.get('/meetups/new', auth.isAuthenticated, MeetupsController.getNew);
  app.get('/meetups/edit/:id', auth.isAuthenticated, MeetupsController.getEdit);
  app.post('/meetups/new', auth.isAuthenticated, MeetupsController.postNew);
  app.post('/meetups/edit', auth.isAuthenticated, MeetupsController.postEdit);

  // public
  app.get('/meetups/:slug', MeetupsController.getMeetup);
  app.get('/meetups', MeetupsController.getMeetups);
};