"use strict";

const App = require('widget-cms');
const MeetupsController = App.getController('Meetups');
const auth = require('../lib/auth');

App.get('/admin/meetups', MeetupsController.getAdmin);
App.get('/admin/meetups/settings', auth.isUserAdmin, MeetupsController.getSettings);
App.get('/meetups/new', auth.isAuthenticated, MeetupsController.getNew);
App.get('/meetups/edit/:id', auth.isAuthenticated, MeetupsController.getEdit);
App.post('/meetups/new', auth.isAuthenticated, MeetupsController.postNew);
App.post('/meetups/edit', auth.isAuthenticated, MeetupsController.postEdit);

// public
App.get('/meetups/:slug', MeetupsController.getMeetup);
App.get('/meetups', MeetupsController.getMeetups);
