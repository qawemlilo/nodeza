"use strict";


var App = require('../app');
var Menus = require('../collections/menus');
var Menu = require('../models/menu');
var Roles = require('../collections/roles');


var MenusController = {

  /*
   * GET /menus/new
   * load new blog post form
   */
  getNewMenu: function (req, res) {
    Roles.forge()
    .fetch({columns: ['id', 'name']})
    .then(function (collection) {
      res.render('menus/new', {
        title: 'New menu',
        description: 'Create a new menu',
        roles: collection.toJSON(),
        page: 'newmenu'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/menus');
    });
  },


  /*
   * GET /menus/edit/:id
   * edit Menu form
   */
  getMenuEdit: function (req, res) {
    Roles.forge()
    .fetch({columns: ['id', 'name']})
    .then(function (rolesCollection) {
      Menu.forge({id: req.params.id})
      .fetch()
      .then(function (menu) {
        res.render('menus/edit', {
          page: 'menuedit',
          title: 'menu edit',
          description: 'menu edit',
          roles: rolesCollection.toJSON(),
          menu: menu.toJSON()
        });
      })
      .catch(function (error) {
        req.flash('errors', {'msg': error.message});
        res.redirect('/admin/menus');
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/menus');
    });
  },



  /**
   * GET /admin/menus
   * get blog posts for current account
   */
  getMenus: function (req, res) {
    var menus = new Menus();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 10,
      page: currentpage,
      base: '/admin/menus',
      where: ['created_at', '<', new Date()],
      order: "asc"
    };

    menus.fetchBy('id', opts)
    .then(function (collection) {
      res.render('menus/menus', {
        title: 'Menus',
        pagination: menus.pages,
        menus: collection.toJSON(),
        description: 'Menus',
        page: 'menus',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },


  /**
   * POST /menus/new
   * save New Menu
  */
  postNewMenu: function(req, res) {
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    Menu.forge({
      name: req.body.name,
      description: req.body.description || '',
      role_id: req.body.role_id
    })
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Menu successfully created.' });
      res.redirect('/admin/menus');
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('back');
    });
  },



  /**
   * POST /menus/edit
   * save Edit Menu
  */
  postEditMenu: function(req, res) {
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('id', 'Missing feilds').isInt();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    Menu.forge({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description || '',
      role_id: req.body.role_id
    })
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Menu successfully updated.' });
      res.redirect('/menus/edit/' + model.get('id'));
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('back');
    });
  },

  /**
   * GET /menus/delete/:id
  */
  getDeleteMenu: function(req, res, next) {
    Menu.forge({id: req.params.id})
    .fetch({withRelated: ['links']})
    .then(function (menu) {
      var links = menu.related('links');

      if (links.length > 0) {
        req.flash('error', { msg: 'You cannot delete a menu that contains links' });
        return res.redirect('back');
      }
      menu.destroy()
      .then(function () {
        req.flash('success', {msg: 'Menu successfully deleted.'});
        res.redirect('back');
      })
      .catch(function (error) {
        req.flash('error', { msg: error.message });
        return res.redirect('back');
      });
    })
    .catch(function (error) {
      req.flash('error', { msg: error.message });
      res.redirect('back');
    });
  }
};


module.exports = App.controller('Menus', MenusController);

