"use strict";

const App = require('widget-cms');
const User = App.getModel('User');
const redis = require('redis');
const Queue = redis.createClient();
const auth = require('../lib/auth');
const Promise = require('bluebird');
const crypto = require('crypto');
const passport = App.passport;
const _ = require('lodash');


/**
 * Converts date in milliseconds to MySQL datetime format
 * @param: ts - date in milliseconds
 * @returns: MySQL datetime
 */
function datetime(ts) {
  return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
}


const AccountController = App.Controller.extend({

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
  getLoginAs: async function(req, res, next) {
    req.assert('id', 'id cannot be blank').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors',  { msg: errors});
      return res.redirect('/login');
    }

    try {
      req.session.isAdmin = req.user.get('id');

      let user = await User.forge({'id': req.params.id}).fetch({required: true});

      req.logIn(user, function(error) {
        if (error) {
          req.flash('errors', { msg: error.message });
          res.redirect('/login');
        }

        res.redirect('/');
      });
    }
    catch (error) {
      req.session.isAdmin = null;
      req.flash('errors', { msg: error.message });
      next(error);
    }
  },


  /**
   * POST /login
   * Log in user
   */
  restoreAdmin: async function(req, res, next) {

    if (!req.session.isAdmin) {
      return res.redirect('back');
    }

    try {
      let user = await User.forge({'id': req.session.isAdmin}).fetch({required: true});

      req.logIn(user, function(error) {
        if (error) {
          req.flash('errors', { msg: error.message });
          res.redirect('/login');
        }

        req.session.isAdmin = null;

        res.redirect('/admin/users');
      });
    }
    catch (error) {
      console.error(error);
      req.flash('errors', { msg: error.message });
      res.redirect('/admin/users');
    }
  },


  /**
   * POST /login
   * Log in user
   */
  postLogin: function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
      if (error) {
        req.flash('errors', { msg: error.message });
        return res.redirect('/login');
      }

      if(!user) {
        req.flash('errors', { msg: info.message });
        return res.redirect('/login');
      }

      req.logIn(user, function(error) {
        if (error) {
          req.flash('errors', { msg: error.message });
          return res.redirect('/login');
        }

        user.save({last_login: new Date()});


        res.redirect(req.session.returnTo || '/dashboard');
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
  postSignup: async function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 6 characters long').len(6);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    let userData = {};

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    try {
      userData.name = req.body.name;
      userData.last_name = '';
      userData.email = req.body.email;
      userData.password = req.body.password;
      userData.role_id = 1;
      userData.updated_by = 1;

      let model = await User.forge(userData).save();

      req.flash('success', {msg: 'Account successfully created! Please complete your profile.'});

      Queue.publish('email', JSON.stringify({
        type: 'registration',
        to: model.toJSON()
      }));

      req.logIn(model, function(error) {
        if (error) {
          req.flash('errors', {'msg': 'An error occured, account not created.'});
          res.redirect('back');
        }

        res.redirect('/admin/account');
      });
    }
    catch (error) {
      console.error(error)
      req.flash('errors', {'msg': 'An error occured, account not created.'});
      res.redirect('back');
    }
  },


  /**
   * GET /reset/:token
   * Loads password reset form.
   */
  getReset: async function(req, res) {
    try {
      let user =  await User.forge().query(function (qb) {
        return qb.where('resetPasswordToken', '=', req.params.token)
        .andWhere('resetPasswordExpires', '>', datetime(Date.now()));
      }).fetch();

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
    }
    catch (error) {
      req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
      res.redirect('/forgot');
    }
  },


  /**
   * POST /reset/:token
   * Process the reset password request.
   */
  postReset: async function (req, res, next) {
    req.assert('password', 'Password must be at least 6 characters long.').len(6);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    let errors = req.validationErrors();


    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let user =  await User.forge().query(function (qb) {
        return qb.where('resetPasswordToken', '=', req.params.token).andWhere('resetPasswordExpires', '>', datetime(Date.now()));
      })
      .fetch();

      user = await user.save({
        password: req.body.password,
        resetPasswordToken: '',
        resetPasswordExpires: ''
      })

      Queue.publish('email', JSON.stringify({
        type: 'password-changed',
        to: user.toJSON()
      }));

      req.logIn(user, function (err) {
        req.flash('success', {msg: 'Your account has been updated'});
        res.redirect('/');
      });
    }
    catch (error) {
      console.error(error);
      req.flash('error', {msg: 'An error has occured, account not updated.'});
      res.redirect('back');
    }
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

    let errors = req.validationErrors();
    let user;

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/forgot');
    }

    User.forge({email: req.body.email})
    .fetch({require:true})
    .then(function(userModel) {
      user = userModel;

      return new Promise(function(resolve, reject) {
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
      Queue.publish('email', JSON.stringify({
        type: 'reset',
        to: userModel.toJSON()
      }));
    })
    .then(function(resp) {
      req.flash('info', {msg: 'An e-mail has been sent to ' + user.get('email') + ' with further instructions.'});
      res.redirect('/forgot');
    })
    .catch(function (error) {
      req.flash('errors', {msg: 'Error occured'});
      res.redirect('back');
    });
  },


  /**
   * GET /admin/account
   * logged in user account details form.
   */
  getAccount: function (req, res) {
    let tokens = req.user.related('tokens').toJSON();
    let github = _.find(tokens, { kind: 'github' });
    let google = _.find(tokens, { kind: 'google' });
    let twitter = _.find(tokens, { kind: 'twitter' });

    res.render('account/account', {
      title: 'My Account',
      description: 'My account details',
      page: 'account',
      github: github,
      twitter: twitter,
      google: google
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
      page: 'password'
    });
  },


  /**
   * GET /admin/account/password
   * logged in user password form
   */
  getLinkedAccounts: function (req, res) {
    let tokens = req.user.related('tokens').toJSON();
    let github = _.find(tokens, { kind: 'github' });
    let google = _.find(tokens, { kind: 'google' });
    let twitter = _.find(tokens, { kind: 'twitter' });

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

    let errors = req.validationErrors();

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
      req.flash('error', { msg: 'Error occured, password not saved.' });
      next(error);
    });
  },


  /**
   * POST /account
   * Edit user account.
  */
  postAccount: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/admin/account');
    }

    let details = {
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
      return user.save(details)
      .then(function() {
        req.flash('success', {msg: 'Account information updated.'});
        res.redirect('/admin/account');
      })
      .catch(function (error) {
        req.flash('error', {msg: error.message});
        next(error);
      });
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next(error);
    });
  },


  /**
   * POST /account/delete
   * Delete user account.
  */
  postDeleteAccount: function(req, res, next) {
    let user = req.user;

    user.deleteAccount(user.get('id'))
    .then(function () {
      req.logout();
      res.redirect('/');
    })
    .catch(function (error) {
      req.flash('error', { msg: error.message });
      next(error);
    });
  },


  /**
   * GET /account/unlink/:provider
   * Unlink an auth account
   */
  getOauthUnlink: function(req, res, next) {
    let provider = req.params.provider;

    req.user.unlink(provider)
    .then(function (msg) {
      req.flash('success', {msg: `${provider} successfully unlinked`});
      res.redirect('back');
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next(error);
    });
  }
});


module.exports = App.addController('Account', AccountController);
