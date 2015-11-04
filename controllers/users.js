
var App = require('../app');
var Users = require('../collections/users');
var Roles = require('../collections/roles');
var Role = require('../models/roles');
var User = require('../models/user');
var twitter = require('../lib/twitter');


var UsersController = {

  /*
   * GET /devs/:id
   * loads an event by id
   */
  getProfile: function (req, res, next) {
    var profile;

    User.forge({slug: req.params.slug})
    .fetch({withRelated: ['posts', 'events']})
    .then(function (user) {
      profile = user;

      if (user.twitterHandle()) {
        return twitter.getTweets(user.twitterHandle());
      }
      else {
        return false;
      }
    })
    .then(function (tweets) {

      res.render('users/profile', {
        title: 'NodeZA profile of ' + profile.get('name'),
        myposts: profile.related('posts').toJSON(),
        myevents: profile.related('events').toJSON(),
        description: 'NodeZA profile of ' + profile.get('name'),
        profile: profile.toJSON(),
        page: 'profile',
        tweets: tweets || []
      });

      profile.viewed();
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error[0].message});
      res.redirect('back');
    });
  },


  /*
   * GET /admin/users/new
   * Load new user form
  **/
  getNewUser: function (req, res, next) {
    res.render('users/new', {
      title: 'New User',
      description: 'New User',
      page: 'newuser'
    });
  },


  /*
   * GET /users/edit/:id
   * Load user edit form
  **/
  getEditUser: function (req, res, next) {
    var roles;

    Roles.forge()
    .fetch()
    .then(function (collection) {
      roles = collection;

      return User.forge({id: req.params.id}).fetch({withRelated: ['role']});
    })
    .then(function (user) {
      res.render('users/edit', {
        title: 'Edit User',
        description: 'Edit User',
        usr: user.toJSON(),
        roles: roles.toJSON(),
        page: 'edituser'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/users');
    });
  },



  /**
   * GET /devs
   * get all users
   */
  getDevs: function (req, res) {
    var users = new Users();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 5,
      page: currentpage,
      order: "asc",
      where: ['created_at', '<', new Date()]
    };

    users.base = '/devs';

    users.fetchBy('id', opts, {withRelated: ['role']})
    .then(function (collection) {
      res.render('users/devs', {
        title: 'Developers',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Developers',
        page: 'devs',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },




  /**
   * GET /admin/users
   * get all users
   */
  getUsers: function (req, res) {
    var users = new Users();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 10,
      page: currentpage,
      order: "asc",
      where: ['created_at', '<', new Date()]
    };

    users.fetchBy('id', opts, {withRelated: ['role']})
    .then(function (collection) {
      res.render('users/users', {
        title: 'Registered Users',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Registered Users',
        page: 'users',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },


  /**
   * POST /users/new
  **/
  postUser: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var details = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role_id: 1
    };

    User.forge(details)
    .save()
    .then(function (user) {
      req.flash('success', {msg: 'User account created'});
      res.redirect('/admin/users');
    })
    .catch(function (error) {
      req.flash('errors', {msg: error.message});
      res.redirect('/admin/users');
    });
  },


  /**
   * POST /users/edit
  **/
  postEditUser: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var details = {
      name: req.body.name,
      email: req.body.email,
      github_url: req.body.github_url,
      twitter_url: req.body.twitter_url,
      role_id: req.body.role_id
    };

    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', {msg: 'Passwords should match'});
        return res.redirect('back');
      }

      details.password = req.body.password;
    }

    User.forge({id: req.body.id})
    .fetch()
    .then(function (user) {
      return user.save(details);
    })
    .then(function(model) {
      req.flash('success', {msg: 'User information updated.'});
      res.redirect('/users/edit/' + model.get('id'));
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/admin/users');
    });
  },


  /**
   * GET /users/delete/:id
   * Delete user account.
  */
  getDeleteUser: function(req, res, next) {
    var user = new User();

    user.deleteAccount(req.params.id)
    .then(function (msg) {
      req.flash('success', {msg: 'User successfully deleted.'});
      res.redirect('back');
    })
    .catch(function (error) {
      console.log(error.stack);
      req.flash('error', { msg: error.message });
      res.redirect('/admin/users');
    });
  }
};


module.exports = App.controller('Users', UsersController);
