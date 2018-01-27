"use strict";

const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const App = require('widget-cms');
const passport = App.passport;
const User = App.getModel('User');
const Tokens = App.getCollection('Tokens');
const config = App.getConfig('github');
const githubConfig = App.getConfig('github');

passport.deserializeUser(async function(id, done) {
  try {
    let user = await User.forge({id: id}).fetch({withRelated: ['role', 'tokens','unreadmessages'],require: true});

    done(false, user);
  }
  catch (error) {
    done(error);
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.get('id'));
});


passport.use(new GitHubStrategy(githubConfig, async function (req, accessToken, refreshToken, profile, done) {

  if (req.user) { // if the user is already logged in
    try {
      let model = await req.user.save({
        github: req.user.id,
        name: req.user.get('name') || profile.displayName,
        image_url: req.user.get('image_url') || profile._json.avatar_url,
        location: req.user.get('location') || profile._json.location,
        website: req.user.get('website') || profile._json.blog || profile._json.profileUrl,
        role_id: req.user.get('role_id') || 1,
        about: req.user.get('about') || profile._json.bio
      });

      let tokens = Tokens.forge({
        user_id: model.get('id'),
        kind: 'github',
        accessToken: accessToken
      }).save();

      req.flash('info', { msg: 'GitHub account has been linked.' });
      done(false, model);
    }
    catch (error) {
      req.flash('errors', { msg: error.message});
      done(error);
    }
  }
  else { // if the user is not logged in
    try {
      let isNewAccount = false;

      let user = await User.forge()
      .query(function (qb) {
        qb.where('github', '=', profile.id).orWhere('email', '=', profile._json.email);
      }).fetch();

      if (!user) {
        user = new User();
        isNewAccount = true;
      }

      user = await user.save({
        email: user.get('email') || profile._json.email,
        github: profile.id,
        name: user.get('name') || profile.displayName,
        image_url: user.get('image_url') || profile._json.avatar_url,
        location: user.get('location') || profile._json.location,
        website: user.get('website') || profile._json.blog,
        about: user.get('about') || profile._json.bio,
        role_id: user.get('role_id') || 1
      });


      Tokens.forge({
        user_id: model.get('id'),
        kind: 'github',
        accessToken: accessToken
      }).save();

      if (isNewAccount) {
        req.flash('info', { msg: 'Account successfully created! You can may also set your password to activate email login.' });
      }
      else {
        req.flash('info', { msg: 'GitHub account has been linked.' });
      }

      req.session.isNewAccount = isNewAccount;

      done(false, model);
    }
    catch (error){
      done(error);
    }
  }
}));


passport.use(new LocalStrategy({ usernameField: 'email' }, async function(email, password, done) {
    try {
      let user = await User.forge({email: email}).fetch();

      if (!user) {
        done(null, false, { message: 'Email ' + email + ' not found'});
      }
      else {
        let isMatch = await user.comparePassword(password);

        if (isMatch) {
          done(null, user);
        } else {
          done(null, false, { message: 'Invalid password'});
        }
      }
    }
    catch (error) {
      req.flash('errors', { msg: error.message});
      done(error);
    }
}));


// Login Required middleware.
module.exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();

  req.flash('errors',  { msg: 'You need to log in first.'});

  res.redirect('/login');
};


module.exports.isNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) return next();

  res.redirect('/');
};


/*
 * Authorization Required middleware.
**/
module.exports.isAuthorized = function (req, res, next) {
  let provider = req.path.split('/').slice(-1)[0];
  let tokens = req.user.related('tokens');

  if (tokens.findWhere({kind: 'github'})) {
    next();
  }
  else {
    res.redirect('/auth/' + provider);
  }
};


module.exports.isUserAdmin = function (req, res, next) {
  if (req.user && req.user.related('role').get('name') === 'Super Administrator') {
    next();
  }
  else {
    req.flash('errors', { msg: 'You are not authorized to perform that action' });
    res.redirect('back');
  }
};
