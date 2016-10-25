"use strict";

const App = require('widget-cms');
const Routes = App.getCollection('Routes');
const Menus = App.getCollection('Menus');
const LinkModel = App.getModel('Link');
const Links = App.getCollection('Links');


const LinksController = App.Controller.extend({

  /*
   * GET /links/new
   * load new blog post form
   */
  getNewLink: function (req, res) {
    let menus = new Menus();
    let routes = new Routes();
    let data = {};

    routes.fetch()
    .then(function (collection) {
      return collection;
    })
    .then(function (routesCollection) {
      data.routes = routesCollection.toJSON();

      return menus.fetch()
      .then(function (collection) {
        return collection;
      });
    })
    .then(function (menutypesCollection) {
      data.menus = menutypesCollection.toJSON();

      res.render('links/new', {
        title: 'New link',
        description: 'Create a new link',
        menus: data.menus,
        routes: data.routes,
        page: 'newmenu'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/links');
    });
  },


  /*
   * GET /links/edit/:id
   * edit Route form
   */
  getEditLink: function (req, res) {
    let menus = new Menus();
    let routes = new Routes();
    let link = new LinkModel({id: req.params.id});
    let data = {};

    routes.fetch()
    .then(function (collection) {
      return collection;
    })
    .then(function (routesCollection) {
      data.routes = routesCollection.toJSON();

      return menus.fetch()
      .then(function (collection) {
        return collection;
      });
    })
    .then(function (menutypesCollection) {
      data.menus = menutypesCollection.toJSON();

      return link.fetch({withRelated: ['route', 'menu']})
      .then(function (model) {
        return model;
      });
    })
    .then(function (model) {
      res.render('links/edit', {
        title: 'Edit link',
        description: 'Edit a link',
        menus: data.menus,
        routes: data.routes,
        link: model.toJSON(),
        page: 'editmenu'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/links');
    });
  },


  /**
   * GET /admin/links
   * get blog posts for current account
   */
  getLinks: function (req, res) {
    let links = new Links();
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let opts = {
      limit: 10,
      page: currentpage,
      base: '/admin/links',
      order: "asc"
    };

    links.fetchBy('id', opts, {withRelated: ['route', 'menu']})
    .then(function (collection) {
      res.render('links/links', {
        title: 'Links',
        pagination: links.pages,
        links: collection.toJSON(),
        description: 'Links',
        page: 'links',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },


  /**
   * POST /links/new
   * save New Route
  */
  postNewLink: function(req, res) {
    req.assert('inner_text', 'Text must be at least 3 characters long').len(3);
    req.assert('menu_id', 'LinkModel Type must not be empty').notEmpty();
    req.assert('route_id', 'Route must not be empty').notEmpty();
    req.assert('icon', 'Glyphicon Icon must not be empty').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let inputs = {
      inner_text: req.body.inner_text,
      menu_id: req.body.menu_id,
      route_id: req.body.route_id,
      icon: req.body.icon,
      title: req.body.title,
      id_attr: req.body.id_attr,
      class_attr: req.body.class_attr,
      target: req.body.target
    };

    LinkModel.forge(inputs)
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'LinkModel successfully created.' });
      res.redirect('/admin/links');
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/admin/links');
    });
  },


  /**
   * POST /links/edit
   * save Edit LinkModel
  */
  postEditLink: function(req, res) {
    req.assert('inner_text', 'Text must be at least 3 characters long').len(3);
    req.assert('menu_id', 'LinkModel Type must not be empty').notEmpty();
    req.assert('route_id', 'Route must not be empty').notEmpty();
    req.assert('icon', 'Glyphicon Icon must not be empty').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let inputs = {
      id: req.body.id,
      inner_text: req.body.inner_text,
      menu_id: req.body.menu_id,
      route_id: req.body.route_id,
      icon: req.body.icon,
      title: req.body.title,
      id_attr: req.body.id_attr,
      class_attr: req.body.class_attr,
      target: req.body.target
    };

    LinkModel.forge(inputs)
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'LinkModel successfully updated.' });
      res.redirect('/links/edit/' + model.get('id'));
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/admin/links');
    });
  },


  /**
   * GET /links/delete/:id
  */
  getDeleteLink: function(req, res, next) {
    LinkModel.forge({id: req.params.id})
    .fetch()
    .then(function (link) {

      link.destroy()
      .then(function () {
        req.flash('success', {msg: 'Link successfully deleted.'});
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
});


module.exports = App.addController('Links', LinksController);
