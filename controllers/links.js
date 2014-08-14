

var App = require('../app');
var Routes = require('../collections/routes');
var Menus = require('../collections/menus');
var LinkModel = require('../models/link');
var Links = require('../collections/links');


var LinksController = {

  /*
   * GET /links/new
   * load new blog post form
   */
  getNewLink: function (req, res) {
    var menus = new Menus();
    var routes = new Routes();
    var data = {};
    
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
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/account/links');      
    });
  },


  /*
   * GET /links/edit/:id
   * edit Route form
   */
  getEditLink: function (req, res) {
    var menus = new Menus();
    var routes = new Routes();
    var link = new LinkModel({id: req.params.id});
    var data = {};
    
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
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/account/links');      
    });
  },


  /**
   * GET /account/links
   * get blog posts for current account
   */
  getLinks: function (req, res) {
    var links = new Links();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 10,
      page: currentpage,
      base: '/account/links',
      where: ['created_at', '<', new Date()],
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
    .otherwise(function (error) {
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

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var inputs = {
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
      res.redirect('/account/links');
    })
    .otherwise(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/account/links');
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

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var inputs = {
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
    .otherwise(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/account/links');
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


module.exports = App.controller('Links', LinksController);

