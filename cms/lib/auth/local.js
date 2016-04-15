"use strict";

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


module.exports = function (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.get('id'));
  });


  passport.deserializeUser(function(id, done) {
    User.forge({id: id})
    .fetch({withRelated: ['role', 'tokens']})
    .then(function(user) {
      done(false, user);
    })
    .catch(function (error) {
      done(error);
    });
  });

  // Sign in using Email and Password.
  passport.use(new LocalStrategy({ usernameField: 'email' },
    function(email, password, done) {
      User.forge({email: email})
      .fetch()
      .then(function(user) {
        if (!user) {
          return done(null, false, { message: 'Email ' + email + ' not found'});
        }

        user.comparePassword(password)
        .then(function(isMatch) {
          if (isMatch) {
            done(null, user);
          } else {
            done(null, false, { message: 'Invalid password.' });
          }
        })
        .catch(function (error) {
          done(null, false, { message: error.message });
        });
      })
      .catch(function (error) {
        done(null, false, {message: error.message});
      });
  }));
};
