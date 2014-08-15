

var passportConf = require('../config/passport');


module.exports = function (app, MeetupsController) {
  // private
  app.get('/admin/meetups', passportConf.isAuthenticated, MeetupsController.getAdmin);
  app.get('/meetups/new', passportConf.isAuthenticated, MeetupsController.getNew);
  app.get('/meetups/edit/:id', passportConf.isAuthenticated, MeetupsController.getEdit);
  app.post('/meetups/new', passportConf.isAuthenticated, MeetupsController.postNew);
  app.post('/meetups/edit', passportConf.isAuthenticated, MeetupsController.postEdit);

  // public
  app.get('/meetups/:slug', MeetupsController.getMeetup);
  app.get('/meetups', MeetupsController.getMeetups);

};