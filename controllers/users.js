
"use strict";

const App = require('widget-cms');
const utils = require('../lib/utils');
const gulpfile = require('../lib/process-images');

const UsersController = App.Controller.extend({

  /*
   * GET /devs/:id
   * loads an event by id
   */
  getProfile: async function (req, res, next) {
    try {
      let profile;
      let User = App.getModel('User');
      let twitter = App.getPlugin('twitter');

      let user  = await User.forge({slug: req.params.slug}).fetch({withRelated: ['posts', 'events']});
      let tweets = user.twitterHandle() ? await twitter.getTweets(user.twitterHandle()) : [];

      user.viewed();

      res.render('users/profile', {
        title: 'NodeZA profile of ' + user.get('name'),
        myposts: user.related('posts').toJSON(),
        myevents: user.related('events').toJSON(),
        description: 'NodeZA profile of ' + user.get('name'),
        profile: user.toJSON(),
        page: 'profile',
        tweets: tweets
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    }
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
  getEditUser: async function (req, res, next) {
    try {
      let Roles = App.getCollection('Roles');
      let User = App.getModel('User');

      let roles = await Roles.forge().fetch();
      let user = await User.forge({id: req.params.id}).fetch({withRelated: ['role']});

      res.render('users/edit', {
        title: 'Edit User',
        description: 'Edit User',
        usr: user.toJSON(),
        roles: roles.toJSON(),
        page: 'edituser'
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/users');
    }
  },



  /**
   * GET /devs
   * get all users
   */
  getDevs: async function (req, res) {
    try {
      let Users = App.getCollection('Users');
      let users = new Users();
      let page = parseInt(req.query.p, 10);
      let currentpage = page || 1;
      let opts = {
        limit: 5,
        page: currentpage,
        order: "asc"
      };

      users.base = '/devs';

      let collection = await users.fetchBy('id', opts, {withRelated: ['role']});

      res.render('users/devs', {
        title: 'Developers',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Developers',
        page: 'devs',
        query: {}
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    }
  },




  /**
   * GET /admin/users
   * get all users
   */
  getUsers: async function (req, res) {
    try {
      let Users = App.getCollection('Users');
      let users = new Users();
      let page = parseInt(req.query.p, 10);
      let currentpage = page || 1;
      let opts = {
        limit: 10,
        page: currentpage,
        order: "asc"
      };

      let collection =  await users.fetchBy('id', opts, {withRelated: ['role']});

      res.render('users/users', {
        title: 'Registered Users',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Registered Users',
        page: 'users',
        query: {}
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    }
  },


  /**
   * POST /users/new
  **/
  postUser: async function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let User = App.getModel('User');
      let details = {
        name: req.body.name,
        last_name: req.body.last_name || '',
        email: req.body.email,
        password: req.body.password,
        role_id: 1
      };

      let user = await User.forge(details).save();

      req.flash('success', {msg: 'User account created'});
      res.redirect('/admin/users');
    }
    catch (error) {
      req.flash('errors', {msg: error.message});
      next(error);
    }
  },


  /**
   * POST /users/edit
  **/
  postEditUser: async function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let User = App.getModel('User');
      let details = {
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

      let user = await User.forge({id: req.body.id}).fetch();
      let model = await user.save(details);

      req.flash('success', {msg: 'User information updated.'});
      res.redirect('/users/edit/' + model.get('id'));
    }
    catch (error) {
      req.flash('error', {msg: error.message});
      next(error);
    }
  },


  /**
   * GET /users/delete/:id
   * Delete user account.
  */
  getDeleteUser: async function(req, res, next) {
    try {
      let User = App.getModel('User');
      let user = new User();

      let msg = await user.deleteAccount(req.params.id);

      req.flash('success', {msg: 'User successfully deleted.'});
      res.redirect('back');
    }
    catch (error) {
      req.flash('error', { msg: error.message });
      next(error);
    }
  },


  getUnsubscribe: async function (req, res) {
    let User = App.getModel('User');
    let user = await User.forge({id: req.params.id}).fetch();

    if (!user) {
      req.flash('errors', {msg: 'Record does not exist.'});
      return res.redirect('/register');
    }

    res.render('users/unsubscribe', {
      title: 'Unsubscribe',
      email: user.get('email'),
      title: 'Unsubscribe',
      description: 'Unsubscribe',
      page: 'unsubscribe'
    });
  },


  postUnsubscribe: async function (req, res) {
    req.assert('email', 'Email is not valid').isEmail();

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let User = App.getModel('User');
    let user = await User.forge({email: req.body.email}).fetch();

    if (user) {
      await user.save({subscribed: 0});
      req.flash('success', {msg: 'You have been unsubscribed from all our emails.'});
    }
    else {
      req.flash('errors', {msg: 'Your email does not exist in our database'});
    }

    res.redirect('back');
  },


  getSubscribeLink: async function (req, res) {
    let user =  await req.user.save({subscribed: true});

    res.redirect('back');
  },


  getUnsubscribeLink: async function (req, res) {
    let user =  await req.user.save({subscribed: false});

    res.redirect('back');
  },


  uploadImage: async function (req, res) {
    let image_url = '';

    if (req.files && req.files.length) {
      image_url = '/uploads/' + req.files[0].filename;

      let user = await req.user.save({image_url: image_url});

      setTimeout(function () {
        gulpfile('public/uploads/' + req.files[0].filename);
      }, 100);

      res.json({
        success: true,
        image_url: image_url
      });
    }
    else {
      res.json({
        success: false,
        errorMsg: 'No file included'
      });
    }


  }
});


module.exports = App.addController('Users', UsersController);
