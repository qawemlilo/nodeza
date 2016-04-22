"use strict";


// Login Required middleware.
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};



exports.isNotAuthenticated = function (req, res, next) {
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

  if (tokens.findWhere({kind: 'github'})) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};


exports.isUserAdmin = function (req, res, next) {

  if (req.user && req.user.related('role').get('name') === 'Super Administrator') {
    next();
  } else {
    req.flash('errors', { msg: 'You are not authorized to perform that action' });
    res.redirect('back');
  }
};
