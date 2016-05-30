"use strict";

const GitHubStrategy = require('passport-github').Strategy;
const App = require('widget-cms');
const passport = App.passport();
const User = App.getModel('User');
const Tokens = App.getCollection('Tokens');
const config = App.getConfig('github');


// Login Required middleware.
exports.isAuthenticated = function (req, res, next) {
  res.use_express_redis_cache = false;

  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};


exports.dontCache = function (req, res, next) {
  res.use_express_redis_cache = false;
  next();
};

exports.isNotAuthenticated = function (req, res, next) {
  res.use_express_redis_cache = false;
  
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};


/*
 * Authorization Required middleware.
**/
exports.isAuthorized = function (req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  var tokens = req.user.related('tokens');

  res.express_redis_cache_name = false;

  if (tokens.findWhere({kind: 'github'})) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};


exports.isUserAdmin = function (req, res, next) {

  res.express_redis_cache_name = false;

  if (req.user && req.user.related('role').get('name') === 'Super Administrator') {
    next();
  } else {
    req.flash('errors', { msg: 'You are not authorized to perform that action' });
    res.redirect('back');
  }
};


// Sign in with GitHub.
passport.use(new GitHubStrategy(config,
  function (req, accessToken, refreshToken, profile, done) {

  // if the user is already logged in
  if (req.user) {
    var user = new User();
    var existingUser = req.user;


    user.query(function (qb) {
      qb.where('github', '=', profile.id).orWhere('email', '=', profile.email);
    })
    .fetch()
    .then(function (model) {
      // account already linked
      if(model) {
        req.flash('errors', {msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done({'errors': {msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' }});
      }
      else {
        existingUser.set({
          github: profile.id,
          name: existingUser.get('name') || profile.displayName,
          image_url: existingUser.get('image_url') || profile._json.avatar_url,
          location: existingUser.get('location') || profile._json.location,
          website: existingUser.get('website') || profile._json.blog || profile._json.profileUrl,
          role_id: existingUser.get('role_id') || 1,
          about: existingUser.get('about') || profile._json.bio
        });

        existingUser.save()
        .then(function (model) {
          Tokens.forge({
            user_id: model.get('id'),
            kind: 'github',
            accessToken: accessToken
          })
          .save()
          .then(function () {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(false, model);
          })
          .catch(function (error) {
            req.flash('errors', { msg: 'Database error. Failed to save token'});
            done(false, model);
          });
        })
        .catch(function () {
          req.flash('errors', { msg: 'Database error. Failed to link GitHub account'});
          done({'errors': {msg: 'Database error. Failed to link GitHub account'}}, existingUser);
        });
      }
    })
    // Database error
    .catch(function () {
      req.flash('errors', { msg: 'Database error. Failed to open Database'});
      done({'errors': {msg: 'Database error. Failed to open Database'}}, user);
    });
  }

  // if the user is not logged in
  else {
    var isNewAccount = false;

    User.forge({github: profile.id})
    .fetch()
    .then(function (existingUser) {
      if (existingUser) {
        return done(null, existingUser);
      }

      User.forge({email: profile._json.email})
      .fetch()
      .then(function (existingEmailUser) {
        var user, roleid;

        if (existingEmailUser) {
          user = existingEmailUser;
          roleid = user.get('role_id');
        } else {
          isNewAccount = true;
          user = new User();
          roleid = 1;
        }

        user.set({
          email: user.get('email') || profile._json.email,
          github: profile.id,
          name: user.get('name') || profile.displayName,
          image_url: user.get('image_url') || profile._json.avatar_url,
          location: user.get('location') || profile._json.location,
          website: user.get('website') || profile._json.blog,
          about: user.get('about') || profile._json.bio,
          role_id: roleid
        });

        user.save()
        .then(function (model) {
          Tokens.forge({
            user_id: model.get('id'),
            kind: 'github',
            accessToken: accessToken
          })
          .save()
          .then(function () {
            if (isNewAccount) {
              req.flash('info', { msg: 'Account successfully created! You can may also set your password to activate email login.' });
            }
            else {
              req.flash('info', { msg: 'GitHub account has been linked.' });
            }

            req.session.isNewAccount = isNewAccount;

            done(false, model);
          })
          .catch(function (error) {
            req.flash('errors', { msg: 'Database error. Failed to save token'});
            done(false, model);
          });
        })
        .catch(function(err) {
          done(err);
        });
      });
    })
    .catch(function (err) {
      req.flash('errors', { msg: 'Database error. Failed to access'});
      done({'errors': {msg: 'Database error. Failed to access'}}, user);
    });
  }
}));
