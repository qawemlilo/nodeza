"use strict";

var App = require('../app');
var Roles = require('../collections/roles');
var Role = require('../models/roles');


var RolesController = {

  /*
   * GET /roles/new
   * Load new user form
  **/
  getNewRole: function (req, res, next) {
    res.render('roles/new', {
      title: 'New Role',
      description: 'New Role',
      page: 'newrole'
    });
  },


  /*
   * GET /roles/edit/:id
   * Load new user form
  **/
  getEditRole: function (req, res, next) {
    Role.forge({id: req.params.id})
    .fetch()
    .then(function (role) {
      res.render('roles/edit', {
        title: 'Edit Role',
        description: 'Edit Role',
        role: role.toJSON(),
        page: 'editrole'
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/users/roles');
    });
  },


  /*
   * GET /admin/users/roles
   * Load user roles
  **/
  getRoles: function (req, res, next) {
    var roles = new Roles();

    roles.fetch()
    .then(function (roles) {
      res.render('roles/roles', {
        title: 'User Roles',
        description: 'User Roles',
        roles: roles.toJSON(),
        page: 'userroles'
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/users');
    });
  },


  /*
   * Post /roles/edit
   * Load new user form
  **/
  postEditRole: function (req, res, next) {
    if (!req.body.name || req.body.name.length < 3) {
      req.flash('errors', {'msg': 'Name should be at least 3 characters'});
      return res.redirect('back');
    }

    Role.forge({id: req.body.id})
    .fetch()
    .then(function (role) {
      role.save({name: req.body.name})
      .then(function () {
        req.flash('success', {msg: 'Role updated'});
        res.redirect('back');
      })
      .otherwise(function (error) {
        req.flash('errors', {'msg': error.message});
        res.redirect('back');
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('back');
    });
  },


  /*
   * Post /roles/edit
   * Load new user form
  **/
  postNewRole: function (req, res, next) {

    if (!req.body.name || req.body.name.length < 3) {
      req.flash('errors', {'msg': 'Name should be at least 3 characters'});
      return res.redirect('back');
    }

    Role.forge({name: req.body.name})
    .save()
    .then(function () {
      req.flash('success', {msg: 'New user role created'});
      res.redirect('back');
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('back');
    });
  },

  /**
   * GET /roles/delete/:id
   * Delete user account.
  */
  getDeleteRole: function(req, res, next) {
    Role.forge({id: req.params.id})
    .fetch({withRelated: ['users']})
    .then(function (role) {
      var users = role.related('users');

      if (users.length > 0) {
        req.flash('error', { msg: 'You cannot delete a role that contains users' });
        return res.redirect('back');
      }
      role.destroy()
      .then(function () {
        req.flash('success', {msg: 'Role successfully deleted.'});
        res.redirect('back');
      })
      .otherwise(function (error) {
        req.flash('error', { msg: error.message });
        return res.redirect('back');
      });
    })
    .otherwise(function (error) {
      req.flash('error', { msg: error.message });
      res.redirect('back');        
    });
  }
};


module.exports = App.controller('Roles', RolesController);
