"use strict";


module.exports = function (app, SiteController) {
  app.get('/', SiteController.getIndex);
  app.get('/about', SiteController.getAbout);
  app.get('/developers', SiteController.getDevelopers);
  app.get('/contact', SiteController.getContact);
  app.get('/privacy', SiteController.getPrivacy);
  app.get('/rss', SiteController.getRSS);
};