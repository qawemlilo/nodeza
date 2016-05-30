"use strict";

const App = require('widget-cms');
const User = App.getModel('User');
const mailGun = require('../lib/mailgun');
const when = require('when');
const crypto = require('crypto');
const passport = App.passport();
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');

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

passport.serializeUser(function(user, done) {
  if(user) {
    done(null, user.get('id'));
  }
  else {
    done(new Error('User account not found'));
  }
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
        console.console.error(error);
        done(null, false, { message: 'Invalid credentials' });
      });
    })
    .catch(function (error) {
      console.error(error);
      done(null, false, { message: 'Invalid credentials' });
    });
}));

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
  getLoginAs: function(req, res, next) {
    req.assert('id', 'id cannot be blank').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors',  { msg: errors});
      return res.redirect('/login');
    }

    req.session.isAdmin = req.user.get('id');

    console.log(req.session.isAdmin);

    User.forge({'id': req.params.id})
    .fetch({required: true})
    .then(function(user) {

      req.logIn(user, function(error) {
        if (error) {
          req.flash('errors', { msg: error.message });
          res.redirect('/login');
        }

        res.redirect('/');
      });
    })
    .catch(function (error) {
      req.session.isAdmin = null;
      req.flash('errors', { msg: error.message });
      next({'errors': {msg: error.message}});
    });
  },


  /**
   * POST /login
   * Log in user
   */
  restoreAdmin: function(req, res, next) {

    if (!req.session.isAdmin) {
      return res.redirect('back');
    }

    User.forge({'id': req.session.isAdmin})
    .fetch({required: true})
    .then(function(user) {

      req.logIn(user, function(error) {
        if (error) {
          req.flash('errors', { msg: error.message });
          res.redirect('/login');
        }

        req.session.isAdmin = null;

        res.redirect('/admin/users');
      });
    })
    .catch(function (error) {
      console.error(error);
      req.flash('errors', { msg: error.message });
      res.redirect('/admin/users');
    });
  },


  /**
   * POST /login
   * Log in user
   */
  postLogin: function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
      if (error) {
        console.error(error.stack);
        req.flash('errors', { msg: err.message });
        return res.redirect('/login');
      }

      req.logIn(user, function(error) {
        if (error) {
          console.error(error.stack);
          req.flash('errors', { msg: error.message });
          return res.redirect('/login');
        }

        if (App.getConfig('cache')) {
          App.clearCache();
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

    if (App.getConfig('cache')) {
      App.clearCache();
    }

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

    let errors = req.validationErrors();
    let userData = {};

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    userData.name = req.body.name;
    userData.last_name = '';
    userData.email = req.body.email;
    userData.password = req.body.password;
    userData.role_id = 1;
    userData.updated_by = 1;

    User.forge(userData)
    .save()
    .then(function (model) {
      if (App.getConfig('cache')) {
        App.clearCache();
      }

      req.flash('success', {msg: 'Account successfully created! Please complete your profile.'});

      req.logIn(model, function(error) {
        if (error) {
          req.flash('errors', {'msg': error.message});
          res.redirect('back');
        }

        res.redirect('/admin/account');
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('back');
    });
  },


  /**
   * GET /reset/:token
   * Loads password reset form.
   */
  getReset: function(req, res) {
    let user =  new User();

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

    let errors = req.validationErrors();
    let user =  new User();

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
      let mailOptions = {
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
      req.flash('errors', {msg: error.message});
      res.redirect('back');
    });
  },


  /**
   * GET /admin/account
   * logged in user account details form.
   */
  getAccount: function (req, res) {
    let tokens = req.user.related('tokens').toJSON();
    let github = _.findWhere(tokens, { kind: 'github' });
    let google = _.findWhere(tokens, { kind: 'google' });
    let twitter = _.findWhere(tokens, { kind: 'twitter' });

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
      page: 'changepassword'
    });
  },


  /**
   * GET /admin/account/password
   * logged in user password form
   */
  getLinkedAccounts: function (req, res) {
    let tokens = req.user.related('tokens').toJSON();
    let github = _.findWhere(tokens, { kind: 'github' });
    let google = _.findWhere(tokens, { kind: 'google' });
    let twitter = _.findWhere(tokens, { kind: 'twitter' });

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
      req.flash('error', { msg: error.message });
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
      user.save(details)
      .then(function() {
        if (App.getConfig('cache')) {
          App.clearCache();
        }

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
      if (App.getConfig('cache')) {
        App.clearCache();
      }

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
      req.flash('info', {msg: msg});
      res.redirect('/admin/account/linked');
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next(error);
    });
  }
});


module.exports = App.addController('Account', AccountController);
