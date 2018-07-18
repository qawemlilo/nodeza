"use strict";

const App = require('widget-cms');
const auth = require('../lib/auth');
const passport = App.passport;


function authCallback(req, res, next) {
  res.redirect(req.session.returnTo || '/');
  next();
}


App.get('/auth/github', passport.authenticate('github'), function(req, res, next) {
  if (res.locals.isNewAccount) return res.redirect('/admin/account/password');

  res.redirect('/admin/account');
});
App.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authCallback);
