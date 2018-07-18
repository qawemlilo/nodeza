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
  console.log(profile);

  // if the user is already logged in
  if (req.user) {
    let existingUser = req.user;

    req.user.set({
      github: profile.id,
      name: existingUser.get('name') || profile.displayName,
      image_url: existingUser.get('image_url') || profile._json.avatar_url,
      location: existingUser.get('location') || profile._json.location,
      website: existingUser.get('website') || profile._json.blog || profile._json.profileUrl,
      role_id: existingUser.get('role_id') || 1,
      about: existingUser.get('about') || profile._json.bio
    });

    req.user.save()
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

  // if the user is not logged in
  else {
    let isNewAccount = false;

    User.forge({github: profile.id})
    .fetch()
    .then(function (existingUser) {
      if (existingUser) {
        return done(null, existingUser);
      }

      return User.forge({email: profile._json.email})
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

        return user.save()
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
