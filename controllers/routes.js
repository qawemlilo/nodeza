

var App = require('../app');
var Routes = require('../collections/routes');
var Route = require('../models/route');
var Roles = require('../collections/roles');


var RoutesController = {

  /*
   * GET /route/new
   * load new blog post form
   */
  getNewRoute: function (req, res) {
    var roles = new Roles();

    roles.fetch({columns: ['id', 'name']})
    .then(function (collection) {
      res.render('routes/new', {
        title: 'New route',
        description: 'Create a new route',
        roles: collection.toJSON(),
        controllers: App.getControllers(),
        page: 'newroute'
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/account/routes');      
    });
  },


  /*
   * GET /route/edit/:id
   * edit Route form
   */
  getEditRoute: function (req, res) {
    var roles = new Roles();

    roles.fetch({columns: ['id', 'name']})
    .then(function (rolesCollection) {
      Route.forge({id: req.params.id})
      .fetch()
      .then(function (route) {
        res.render('routes/edit', {
          page: 'categoryedit',
          title: 'route edit',
          description: 'route edit',
          route: route.toJSON(),
          controllers: App.getControllers(),
          roles: rolesCollection.toJSON()
        });
      })
      .otherwise(function (error) {
        req.flash('errors', {'msg': error.message});
        res.redirect('/account/routes');      
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/account/routes');      
    });
  },


  /**
   * GET /account/blog/routes
   * get blog posts for current account
   */
  getRoutes: function (req, res) {
    var routes = new Routes();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 10,
      page: currentpage,
      base: '/account/routes',
      where: ['created_at', '<', new Date()],
      order: "asc"
    };

    routes.fetchBy('id', opts, {withRelated: ['role']})
    .then(function (collection) {
      res.render('routes/routes', {
        title: 'Blog Routes',
        pagination: routes.pages,
        routes: collection.toJSON(),
        description: 'Blog Routes',
        page: 'adminblog',
        query: {}
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/account');      
    });
  },


  /**
   * POST /route/new
   * save New Route
  */
  postNewRoute: function(req, res) {
    req.assert('path', 'Path must be at least 2 characters long').len(2);
    req.assert('controller_name', 'controller name must not be empty').notEmpty();
    req.assert('controller_method', 'controller method must not be empty').notEmpty();
    req.assert('http_method', 'http method must not be empty').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var inputs = {
      path: req.body.path,
      controller_name: req.body.controller_name,
      controller_method: req.body.controller_method,
      http_method: req.body.http_method,
      role_id: req.body.role_id
    };

    if (!App.testController(inputs.controller_name, inputs.controller_method)) {
      req.flash('error',  { msg: 'Controller method does not exist'});
      return res.redirect('/account/routes');
    }

    Route.forge(inputs)
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Route successfully created.' });
      res.redirect('/account/routes');
    })
    .otherwise(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/account/routes');
    });
  },


  /**
   * POST /route/edit
   * save Edit Route
  */
  postEditRoute: function(req, res) {
    req.assert('path', 'Path must be at least 2 characters long').len(2);
    req.assert('controller_name', 'controller name must not be empty').notEmpty();
    req.assert('controller_method', 'controller method must not be empty').notEmpty();
    req.assert('http_method', 'http method must not be empty').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var inputs = {
      id: req.body.id,
      path: req.body.path,
      controller_name: req.body.controller_name,
      controller_method: req.body.controller_method,
      http_method: req.body.http_method,
      role_id: req.body.role_id
    };

    if (!App.testController(inputs.controller_name, inputs.controller_method)) {
      req.flash('error',  { msg: 'Controller method does not exist'});
      return res.redirect('back');
    }

    Route.forge(inputs)
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Route successfully updated.' });
      res.redirect('back');
    })
    .otherwise(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('back');
    });
  },


  /**
   * GET /routes/delete/:id
  */
  getDeleteRoute: function(req, res, next) {
    Route.forge({id: req.params.id})
    .fetch({withRelated: ['links']})
    .then(function (route) {
      var links = route.related('links');

      if (links.length > 0) {
        req.flash('error', { msg: 'You cannot delete a route associated with links' });
        return res.redirect('back');
      }
      route.destroy()
      .then(function () {
        req.flash('success', {msg: 'Route successfully deleted.'});
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


module.exports = App.controller('Routes', RoutesController);

