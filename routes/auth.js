"use strict";


var passport = require('passport');


function authCallback(req, res) {
  res.redirect(req.session.returnTo || '/');
}


module.exports = function (app) {
  app.get('/auth/github', passport.authenticate('github'), function(req, res, next) {
    if (res.locals.isNewAccount) return res.redirect('/admin/account/password');
    next();
  });
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authCallback);

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), authCallback);

  app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authCallback);
};