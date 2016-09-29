"use strict";

const _ = require('lodash');
const csrf = require('lusca').csrf();


module.exports.returnTo = function() {
  return function (req, res, next) {
    // Keep track of previous URL to redirect back to
    // original destination after a successful login.
    if (req.method !== 'GET') {
      return next();
    }

    let path = req.path.split('/')[1];

    if (/(auth|login|logout|signup)$/i.test(path)) {
      return next();
    }

    req.session.returnTo = req.path;

    next();
  };
};



module.exports.sessionHistory = function() {
  return function(req, res, next) {
    if (req.user) {
      // make user object available in templates
      res.locals.user = req.user.toJSON();

      // also make session available in template
      res.locals.isAdminMode = req.session.isAdmin;

      req.session.userid = req.user.get('id');
    }

    res.locals.sessionHistory = req.session.history;
    res.locals.base = 'http://' + req.headers.host;

    next();
  };
};



module.exports.csrf = function(opts) {
  return function(req, res, next) {
    if (_.contains(opts.whitelist, req.path)) {
      return next();
    }

    csrf(req, res, next);
  };
};
