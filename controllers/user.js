
var User = require('../models/user');
var Tokens = require('../models/token');
var Mailer = require('../lib/mailer');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var _ = require('underscore');


/**
 * Converts date in milliseconds to MySQL datetime format
 * @param: ts - date in milliseconds
 * @returns: - MySQL datetime
 */

function datetime(ts) {
  return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = {

  /**
   * GET /login
   * View login page
   */

  getLogin: function (req, res) {
    res.render('login', {
      title: 'Log In',
      loggedIn: !!req.user
    });
  },


  /**
   * POST /login
   * Logs in user
   */

  postLogin: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
  
    var errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors',  { msg: errors});

      return res.redirect('/login');
    }
  
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash('errors', { msg: info.message });
        return res.redirect('/login');
      }
      
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }

        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  },


  /**
   * GET /logout
   * Logout user
   */

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },


  /**
   * GET /signup
   * Get signup form.
   */

  getSignup: function (req, res) {
    res.render('signup', {
      title: 'Sign Up',
      loggedIn: !!req.user
    });
  },


  /**
   * POST /signup
   * Registers user
   */

  postSignup: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 6 characters long').len(6);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  
    var errors = req.validationErrors();
    var userData = {};
    var user;
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    user = new User();

    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.role_id = 1;

    user.generatePasswordHash(req.body.password, function (err, hash) {
      
      if (err) {
        return next(err);
      }

      userData.password = hash;

      user.set(userData)
      .save()
      .then(function (model) {
        req.flash('success', { msg: 'Account successfully created! You are now logged in.' });

        req.logIn(model, function(err) {
          if (err) {
            return next(err);
          }
          
          res.redirect('/');
        });         
      })
      .otherwise(function () {
        req.flash('errors', {'msg': 'Database error. Account not created.'});
        return res.redirect('/signup');
      });
    });
  },


  /**
   * GET /reset/:token
   * Loads password reset form.
   */

  getReset: function(req, res) {

    var user =  new User();

    user.query(function (qb) {
      qb.where('resetPasswordToken', '=', req.params.token)
      .andWhere('resetPasswordExpires', '>', datetime(Date.now()));
    })
    .fetch()
    .then(function(user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('password', {
        title: 'Password Reset',
        token: req.params.token,
        loggedIn: !!req.user
      });
    })
    .otherwise(function () {
      req.flash('errors', { msg: 'Database error. Could not process query.' });
      return res.redirect('/forgot');
    });
  },
  

  /**
   * POST /reset/:token
   * Process the reset password request.
   */

  postReset: function (req, res, next) {
    req.assert('password', 'Password must be at least 6 characters long.').len(6);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);
  
    var errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }
  
    async.waterfall([
      function(done) {
        var user =  new User();

        user.query(function (qb) {
          qb.where('resetPasswordToken', '=', req.params.token)
          .andWhere('resetPasswordExpires', '>', datetime(Date.now()));
        })
        .fetch()
        .then(function(model) {
          if (!model) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.generatePasswordHash(req.body.password, function (err, hash) {
            if (err) {
              return next(error);
            }
            user.set({
              password: hash,
              resetPasswordToken: null,
              resetPasswordExpires: null
            });

            user.save().then(function (user) {
              if (!user) {
                return next({errors: {msg: 'Failed to save new password.'}});
              }
              req.logIn(user, function (err) {
                done(err, user);
              });
            })
            .otherwise(function () {
              next({errors: {msg: 'Database error. Failed to save new password.'}});
            });
          });
        })              
        .otherwise(function () {
          next({errors: {msg: 'Database error. Failed to execute query.'}});
        });
      },
      function(user, done) {
        var mailOptions = {
          to: user.get('email'),
          from: 'qawemlilo@gmail.com',
          subject: 'Your NodeZA password has been changed',
          body: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.get('email') + ' has just been changed.\n'
        };
        
        Mailer(mailOptions, function (err) {
          req.flash('success', { msg: 'Success! Your password has been changed.' });
          done(err);
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  },
  

  /**
   * GET /forgot
   * Loads forgot password page.
   */

  getForgot: function (req, res) {
    res.render('forgot', {
      title: 'Forgot Password',
      loggedIn: !!req.user
    });
  },

  
  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */

  postForgot: function (req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
  
    var errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/forgot');
    }
  
    async.waterfall([
      function (done) {
        crypto.randomBytes(16, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.forge({email: req.body.email})
        .fetch()
        .then(function(user) {
          if (!user) {
            req.flash('errors', { msg: 'No account with that email address exists.' });
            return res.redirect('/forgot');
          }
  
          user.set({
            resetPasswordToken: token,
            resetPasswordExpires: datetime(Date.now() + 3600000)
          });
  
          user.save().then(function(model) {
            done(false, token, model);
          })
          .otherwise(function () {
            done({'errors': {msg: 'Database error'}});
          });
        });
      },
      function(token, user, done) {
        
        var mailOptions = {
          to: user.get('email'),
          from: 'qawemlilo@gmail.com',
          subject: 'Reset your password on NodeZA',
          body: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n' +
            'NodeZA Team'
        };

        Mailer(mailOptions, function(err, resp) {
          req.flash('info', {msg: 'An e-mail has been sent to ' + user.get('email') + ' with further instructions.' });
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  },


  /**
   * GET /account
   * logged in user account details form.
   */

  getAccount: function (req, res) {
    res.render('account', {
      title: 'My Account',
      loggedIn: !!req.user
    });
  },


  /**
   * GET /account/password
   * logged in user password form
   */

  getPasswordForm: function (req, res) {
    res.render('password', {
      title: 'Change Password',
      loggedIn: !!req.user
    });
  },


  /**
   * GET /account/password
   * logged in user password form
   */

  getLinkedAccounts: function (req, res) {
    var tokens = req.user.related('tokens').toJSON();
    var github = _.findWhere(tokens, { kind: 'github' });

    res.render('linkedaccounts', {
      title: 'Linked Accounts',
      github: github,
      loggedIn: !!req.user
    });
  },


  /**
   * POST /account/password
   * change user password.
  */

  postPassword: function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/account');
    }

    user = req.user;

    user.generatePasswordHash(req.body.password, function (err, hash) {
      user.set({password: hash})
      .save()
      .then(function () {
        req.flash('success', { msg: 'Password has been changed.' });
        res.redirect('/account/password');
      })
      .otherwise(function () {
        req.flash('error', { msg: 'Failed to change password.' });
        res.redirect('/account/password');
      });

    });
  },


  /**
   * POST /account
   * Edit user account.
  */

  postAccount: function(req, res, next) {
    var user = req.user, name;

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    user.set({
      last_name: req.body.last_name,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      location:req.body.location,
      website: req.body.website,
      about: req.body.about
    });

    user.save().then(function() {
      req.flash('success', { msg: 'Account information updated.' });
      res.redirect('/account');
    })
    .otherwise(function () {
      req.flash('error', { msg: 'Account information not updated.' });
      res.redirect('/account');
    });
  },


  /**
   * POST /account/delete
   * Delete user account.
  */

  postDeleteAccount: function(req, res, next) {
    var user = req.user;
    var tokens = user.related('tokens');

    if (tokens) {
      
      // first remove tokens associated with user 
      tokens.mapThen(function(model) {
        return model.destroy().then(function() {
          return 'TokenId ' + model.get('id') + ' - Deleted';
        });
      })
      .then(function(resp) {
        user.destroy().then(function () {
          req.logout();
          res.redirect('/');
        })
        .otherwise(function () {
          req.flash('error', { msg: 'Database errror. Failed to delete account.' });
          res.redirect('/account');        
        });
      })
      .otherwise(function () {
        req.flash('error', { msg: 'Database errror. Failed to delete account.' });
        res.redirect('/account');
      });
    }
    else {
      user.destroy().then(function () {
        req.logout();
        res.redirect('/');
      })
      .otherwise(function () {
        req.flash('error', { msg: 'Database errror. Failed to delete account.' });
        res.redirect('/account');        
      });      
    }
  },


  /**
   * GET /account/unlink/:provider
   * Unlink an auth account
   */

  getOauthUnlink: function(req, res, next) {
    var provider = req.params.provider;
    var tokens = req.user.related('tokens').toJSON();
    var token = _.findWhere(tokens, {kind: provider});
    
    if (token) {
      if (token.kind === 'github') req.user.set({'github': null});
      if (token.kind === 'twitter') req.user.set({'github': null});
      if (token.kind === 'google') req.user.set({'google': null});

      req.user.save().then(function () {
        Tokens.forge({id: token.id}).fetch().then(function(model) {
          model.destroy().then(function () {
            req.flash('info', { msg: provider + ' account has been unlinked.' }); 
            res.redirect('/account/linked');
          })
          .otherwise(function () {
            req.flash('error', { msg: 'Database error. ' + provider + ' account has been unlinked.' }); 
            next({'errors': { msg: 'Failed to unlinked ' + provider + ' account.'}});
          }); 
        })
        .otherwise(function () {
          req.flash('error', { msg: 'Database error. Failed to fetch ' + provider + ' token.' }); 
          next({'errors': { msg: 'Database error. Failed to fetch ' + provider + ' token.'}});
        });
      })
      .otherwise(function () {
        req.flash('error', { msg: 'Database error. Failed to update user ' + provider + ' id.' }); 
        next({'errors': { msg: 'Database error. Failed to update user ' + provider + ' id.'}});
      });
    }
    else {
      req.flash('error', {msg: 'Could not find ' + provider + ' token.'}); 
      next({'errors': {msg: 'Could not find ' + provider + ' token.'}});
    }
  }
};
