


var App = require('../app');
var Categories = require('../collections/categories');
var Category = require('../models/category');


var CategoriesController = {

  /*
   * GET /category/edit/:id
   * edit Category form
   */
  getCategoryEdit: function (req, res) {
    var id = req.params.id;

    Category.forge({id: id})
    .fetch()
    .then(function (category) {
      res.render('posts/edit_category', {
        page: 'categoryedit',
        title: 'category edit',
        description: 'category edit',
        category: category.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Category not found.'});
      res.redirect('/account/blog/categories');      
    });
  },



  /**
   * GET /account/blog/categories
   * get blog posts for current account
   */
  getCategories: function (req, res) {
    var categories = new Categories();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var opts = {
      limit: 10,
      page: currentpage,
      base: '/account/blog/categories',
      where: ['created_at', '<', new Date()],
      order: "asc"
    };

    categories.fetchBy('name', opts)
    .then(function (collection) {
      res.render('posts/categories', {
        title: 'Blog Categories',
        pagination: categories.pages,
        categories: collection.toJSON(),
        description: 'Blog Categories',
        page: 'adminblog',
        query: {}
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/account/blog');      
    });
  },



  /*
   * GET /category/new
   * load new blog post form
   */
  getNewCategory: function (req, res) {
    res.render('posts/new_category', {
      title: 'New category',
      description: 'Create a new category',
      page: 'newcategory'
    });
  },



  /**
   * POST /category/new
   * save New Category
  */
  postNewCategory: function(req, res) {
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    Category.forge({
      name: req.body.name,
      description: req.body.description || ''
    })
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Category successfully created.' });
      res.redirect('/category/edit/' + model.get('id'));
    })
    .otherwise(function (error) {
      req.flash('error', {msg: 'Category could not be created.'});
      res.redirect('back');
    });
  },



  /**
   * POST /category/edit
   * save Edit Category
  */
  postEditCategory: function(req, res) {
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('id', 'Missing feilds').isInt();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    Category.forge({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description || ''
    })
    .save()
    .then(function(model) {
      req.flash('success', { msg: 'Category successfully updated.' });
      res.redirect('/category/edit/' + model.get('id'));
    })
    .otherwise(function (error) {
      req.flash('error', {msg: 'Category could not be updated.'});
      res.redirect('back');
    });
  },

  /**
   * GET /category/delete/:id
  */
  getDeleteCategory: function(req, res, next) {
    Category.forge({id: req.params.id})
    .fetch({withRelated: ['posts']})
    .then(function (category) {
      var posts = category.related('posts');

      if (posts.length > 0) {
        req.flash('error', { msg: 'You cannot delete a category that contains posts' });
        return res.redirect('back');
      }
      category.destroy()
      .then(function () {
        req.flash('success', {msg: 'Category successfully deleted.'});
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


module.exports = App.controller('Categories', CategoriesController);

