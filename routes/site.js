"use strict";

const App = require('widget-cms');
const SiteController = App.getController('Site');


App.get('/', SiteController.getIndex);
App.get('/about', SiteController.getAbout);
App.get('/developers', SiteController.getDevelopers);
App.get('/contact', SiteController.getContact);
App.get('/privacy', SiteController.getPrivacy);
App.get('/rss', SiteController.getRSS);
App.post('/subscribe', SiteController.postSubscribe);
App.get('/subscribe/confirm/:email', SiteController.getConfirmSubscription);
App.get('/unsubscribe/:email', SiteController.unSubscribe);
