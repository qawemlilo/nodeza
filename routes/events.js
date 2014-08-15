

var passportConf = require('../config/passport');

/*
  var blacklist = [
    {'/login': ['get', 'post']},
    {'/signup': ['get', 'post']},
    {'/account': ['get', 'post']},
    {'/forgot': ['get', 'post']},
    {'/reset/:token': ['get', 'post']},
    {'/logout': ['get']},
    {'/account/password': ['get', 'post']},
    {'/account/delete': ['post']},
    {'/account/linked': ['get']},
    {'/account/unlink/:provider': ['get']},
    {'/auth/github': ['get']},
    {'/auth/github/callback': ['get']},
    {'/auth/twitter': ['get']},
    {'/auth/twitter/callback': ['get']},
    {'/auth/google': ['get']},
    {'/auth/google/callback': ['get']},
    {'/account/blog/categories': ['get']},
    {'/category/edit/:id': ['get']},
    {'/category/new': ['get', 'post']},
    {'/category/edit': ['post']},
    {'/category/delete/:id': ['get']},
  ];
*/

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
};