"use strict";

var App = require('../app');
var User = require('../models/user');
var mailGun = require('../lib/mailgun');
var when = require('when');
var crypto = require('crypto');
var passport = require('passport');
var _ = require('lodash');


/**
 * Converts date in milliseconds to MySQL datetime format
 * @param: ts - date in milliseconds
 * @returns: MySQL datetime
 */
function datetime(ts) {
  return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
}


var AccountController = {

  /**
   * GET /login
   * View login page
   */
  getLogin: function (req, res) {
    res.render('account/login', {
      title: 'Log In',
      description: 'NodeZA log in page',
      page: 'login'
    });
  },


  /**
   * POST /login
   * Log in user
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
          req.flash('errors', { msg: err.message });
          res.redirect('/login');
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
    res.render('account/signup', {
      title: 'Sign Up',
      description: 'Sign up and become part of the Node.js community in South Africa',
      page: 'signup'
    });
  },


  /**
   * POST /signup
   * Registers user
  **/
  postSignup: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 6 characters long').len(6);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    var userData = {};

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.password = req.body.password;
    userData.role_id = 1;

    User.forge(userData)
    .save()
    .then(function (model) {
      req.flash('success', {msg: 'Account successfully created! Please complete your profile.'});

      req.logIn(model, function(err) {
        if (err) {
          return next(err);
        }

        res.redirect('/admin/account');
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/signup');
    });
  },


  /**
   * GET /reset/:token
   * Loads password reset form.
   */
  getReset: function(req, res) {
    var user =  new User();

    user.query(function (qb) {
      return qb.where('resetPasswordToken', '=', req.params.token)
      .andWhere('resetPasswordExpires', '>', datetime(Date.now()));
    })
    .fetch()
    .then(function(user) {
      if (!user) {
        req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
        return res.redirect('/forgot');
      }

      res.render('account/reset', {
        title: 'Password Reset',
        token: req.params.token,
        description: 'Reset your password',
        page: 'resetpassword'
      });
    })
    .catch(function (error) {
      req.flash('errors', { msg: error.message });
      res.redirect('/forgot');
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
    var user =  new User();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    user.query(function (qb) {
      return qb.where('resetPasswordToken', '=', req.params.token)
      .andWhere('resetPasswordExpires', '>', datetime(Date.now()));
    })
    .fetch()
    .then(function(userModel) {
      return userModel.save({
        password: req.body.password,
        resetPasswordToken: '',
        resetPasswordExpires: ''
      });
    })
    .then(function (userModel) {
      return mailGun.sendEmail({
        to: userModel.get('email'),
        subject: 'Your NodeZA password has been changed',
        body: 'Hello, <br><br>' + 'This is a confirmation that the password for your account ' + user.get('email') + ' has just been changed.'
      });
    })
    .then(function (mailRes) {
      req.logIn(user, function (err) {
        req.flash('success', {msg: 'Your account has been updated'});
        res.redirect('/');
      });
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('back');
    });
  },


  /**
   * GET /forgot
   * Loads forgot password page.
   */
  getForgot: function (req, res) {
    res.render('account/forgot', {
      title: 'Forgot Password',
      description: 'Forgotten password',
      page: 'forgot'
    });
  },


  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  postForgot: function (req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();
    var user;

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/forgot');
    }

    User.forge({email: req.body.email})
    .fetch({require:true})
    .then(function(userModel) {
      user = userModel;

      return when.promise(function(resolve, reject, notify) {
        crypto.randomBytes(16, function (err, buf) {
          if(err) {
            reject(err);
          }
          else {
            resolve(buf.toString('hex'));
          }
        });
      });
    })
    .then(function (token) {
      return user.save({
        resetPasswordToken: token,
        resetPasswordExpires: datetime(Date.now() + 3600000)
      });
    })
    .then(function(userModel) {
      var mailOptions = {
        to: userModel.get('email'),
        subject: 'Reset your password on NodeZA',
        body: 'Hi there ' + userModel.get('name') + ', <br><br>' +
          'You are receiving this email because you (or someone else) have requested the reset of the password for your account.<br>' +
          'Please click on the following link, or paste this into your browser to complete the process:<br><br>' +
          'http://' + req.headers.host + '/reset/' + userModel.get('resetPasswordToken') + '<br><br>' +
          'If you did not request this, please ignore this email and your password will remain unchanged.'
      };

      return mailGun.sendEmail(mailOptions);
    })
    .then(function(resp) {
      req.flash('info', {msg: 'An e-mail has been sent to ' + user.get('email') + ' with further instructions.'});
      res.redirect('/forgot');
    })
    .catch(function (error) {
      console.error(error);
      req.flash('errors', {msg: error.message});
      res.redirect('back');
    });
  },


  /**
   * GET /admin/account
   * logged in user account details form.
   */
  getAccount: function (req, res) {
    res.render('account/account', {
      title: 'My Account',
      description: 'My account details',
      page: 'account',
      gravatar: req.user.gravatar(100)
    });
  },


  /**
   * GET /admin/account/password
   * logged in user password form
   */
  getPasswordForm: function (req, res) {
    res.render('account/password', {
      title: 'Change Password',
      description: 'Change your password',
      page: 'changepassword'
    });
  },


  /**
   * GET /admin/account/password
   * logged in user password form
   */
  getLinkedAccounts: function (req, res) {
    var tokens = req.user.related('tokens').toJSON();
    var github = _.findWhere(tokens, { kind: 'github' });
    var google = _.findWhere(tokens, { kind: 'google' });
    var twitter = _.findWhere(tokens, { kind: 'twitter' });

    res.render('account/linked', {
      title: 'Linked Accounts',
      github: github,
      twitter: twitter,
      google: google,
      description: 'Your linked accounts',
      page: 'linkedaccounts'
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
      return res.redirect('back');
    }

    req.user.save({password: req.body.password})
    .then(function () {
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/admin/account/password');
    })
    .catch(function (error) {
      req.flash('error', { msg: error.message });
      res.redirect('/admin/account/password');
    });
  },


  /**
   * POST /account
   * Edit user account.
  */
  postAccount: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/admin/account');
    }

    var details = {
      last_name: req.body.last_name,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      location:req.body.location,
      website: req.body.website,
      twitter_url: req.body.twitter_url,
      github_url: req.body.github_url,
      about: req.body.about,
      updated_by: req.user.get('id')
    };

    User.forge({id: req.body.id})
    .fetch()
    .then(function (user) {
      user.save(details)
      .then(function() {
        req.flash('success', {msg: 'Account information updated.'});
        res.redirect('/admin/account');
      })
      .catch(function (error) {
        req.flash('error', {msg: error.message});
        res.redirect('/admin/account');
      });
    })
    .catch(function () {
      req.flash('error', {msg: 'Account not found.'});
      res.redirect('/');
    });
  },


  /**
   * POST /account/delete
   * Delete user account.
  */
  postDeleteAccount: function(req, res, next) {
    var user = req.user;

    user.deleteAccount(user.get('id'))
    .then(function () {
      req.logout();
      res.redirect('/');
    })
    .catch(function (error) {
      req.flash('error', { msg: error.message });
      res.redirect('/admin/account');
    });
  },


  /**
   * GET /account/unlink/:provider
   * Unlink an auth account
   */
  getOauthUnlink: function(req, res, next) {
    var provider = req.params.provider;

    req.user.unlink(provider)
    .then(function (msg) {
      req.flash('info', {msg: msg});
      res.redirect('/admin/account/linked');
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next({'errors': {msg: error.message}});
    });
  }
};


module.exports = App.controller('Account', AccountController);
