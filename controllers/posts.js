"use strict";

var App = require('../app');
var Posts = require('../collections/posts');
var Post = require('../models/post');
var Categories = require('../collections/categories');
var Category = require('../models/category');
var _ = require('lodash');
var path =  require('path');
var imgProcessorFile = path.resolve(__dirname, '../lib/process-images.js');


function processMyImg (url) {
  var imgProcessor = require('child_process').fork(imgProcessorFile);

  imgProcessor.on('message', function(message) {
    console.log(message);
  });

  imgProcessor.send(path.resolve(__dirname, '..', url));
}


function processTags(tags) {
  if (!tags) {
    return false;
  }

  tags = tags.split(',');

  tags = tags.map(function (tag) {
    return {name: tag.trim()};
  });

  return tags;
}


var PostsController = {

  getSettings: function (req, res) {
    res.render('posts/config', {
      title: 'Posts Config',
      description: 'Posts Config',
      page: 'globalconfig',
      blog: App.getConfig('blog')
    });
  },


  /*
   * GET /blog/:slug
   * loads a blog post by slug
   */
  getPost: function (req, res) {
    var slug = req.params.slug;
    var settings = App.getConfig('blog');

    return Post.forge({slug: slug, published: 1})
    .fetch({
      withRelated: ['created_by', 'tags', 'category']
    })
    .then(function (post) {
      var author = post.related('created_by').getJSON(['slug', 'name', 'about']);

      author.gravatar = post.related('created_by').gravatar(48);

      res.render('posts/post', {
        page: 'blog',
        config: settings,
        gravatar: post.related('created_by').gravatar(48),
        title: post.get('title'),
        description: post.get('meta_description'),
        author: author,
        category: post.related('category').toJSON(),
        url: 'http://' + req.headers.host + '/blog/' + slug,
        keywords: _.pluck(post.related('tags').toJSON(), 'name'),
        post: post.toJSON()
      });

      // post has been viewed
      post.viewed();
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Page not found :('});
      res.redirect('/blog');
    });
  },



  /*
   * GET /blog/edit/:id
   * edit post form
   */
  getEdit: function (req, res) {
    var id = req.params.id;
    var categories = new Categories();

    categories.fetch()
    .then(function (cats) {
      Post.forge({id: id})
      .fetch({withRelated: ['tags']})
      .then(function (post) {
        res.render('posts/edit', {
          page: 'postedit',
          title: 'Post edit',
          description: 'Post edit',
          categories: cats.toJSON(),
          tags: post.related('tags').toJSON(),
          post: post.toJSON()
        });
      })
      .otherwise(function () {
        req.flash('errors', {'msg': 'Post not found.'});
        res.redirect('/admin/blog');
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Categories not found.'});
      res.redirect('/admin/blog');
    });
  },


  /**
   * GET /blog
   */
  getBlog: function (req, res) {
    var posts = new Posts();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var settings = App.getConfig('blog');

    res.locals._page = 'blog';

    if (currentpage < 1) {
      res.redirect('/blog');
    }

    posts.fetchBy('published_at', {
      page: currentpage,
      limit: settings.postsPerPage
    }, {
      columns: ['slug', 'html', 'image_url', 'title', 'category_id', 'published_at'],
      withRelated: ['category']
    })
    .then(function (collection) {
      res.render('posts/posts', {
        title: settings.title || 'Blog',
        pagination: posts.pages,
        posts: collection.toJSON(),
        description: settings.description || 'Node.js tutorials, articles and news',
        page: 'blog',
        tag: '',
        category: '',
        query: {},
        config: settings
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },


  /**
   * GET /blog/category/:slug
   * loads posts by category
  **/
  getBlogCategory: function (req, res) {
    var posts = new Posts();
    var slug = req.params.slug;
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var settings = App.getConfig('blog');

    if (currentpage < 1) {
      res.redirect('/blog/category/' + slug);
    }

    Category.forge({slug: slug})
    .fetch({columns: ['id', 'name']})
    .then(function (model) {
      var categoryName  = model.get('name');

      posts.fetchBy('created_at', {
        limit: settings.postsPerPage,
        page: currentpage,
        andWhere: ['category_id', '=', model.get('id')],
        base:'/blog/category/' + slug
      }, {
        columns: ['slug', 'html', 'image_url', 'title', 'category_id', 'published_at'],
        withRelated: ['category']
      })
      .then(function (collection) {
        res.render('posts/posts', {
          title: 'Blog',
          pagination: posts.pages,
          posts: collection.toJSON(),
          description: 'Node.js tutorials, articles and news',
          page: 'blog',
          tag: '',
          category: categoryName,
          query: {}
        });
      })
      .otherwise(function () {
        req.flash('errors', {'msg': 'Database error.'});
        res.redirect('/');
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/');
    });
  },



  /**
   * GET /admin/blog
   * get blog posts for current account
   */
  getAdmin: function (req, res) {
    var posts = new Posts();
    var page = parseInt(req.query.p, 10);
    var currentpage = page || 1;
    var role = req.user.related('role').toJSON();
    var opts = {
      limit: 10,
      page: currentpage,
      base: '/admin/blog'
    };

    if (role.name !== 'Super Administrator') {
      opts.where = ['user_id', '=', req.user.get('id')];
    }
    else {
      opts.where = ['created_at', '<', new Date()];
    }

    posts.fetchBy('id', opts, {withRelated: ['category']})
    .then(function (collection) {
      res.render('posts/admin', {
        title: 'Blog',
        pagination: posts.pages,
        posts: collection.toJSON(),
        description: 'Node.js tutorials, articles and news',
        page: 'adminblog',
        query: {}
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/');
    });
  },



  /*
   * GET /blog/new
   * load new blog post form
   */
  getNew: function (req, res) {
    var categories = new Categories();

    categories.fetch()
    .then(function (collection) {
      res.render('posts/new', {
        title: 'New Post',
        description: 'Create a new post',
        page: 'newpost',
        categories: collection.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/admin/blog');
    });
  },



  /**
   * POST /blog/new
   * save blog post
  */
  postNew: function(req, res) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('tags', 'Tags must not be empty').notEmpty();
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var post = new Post();
    var postData = {
      user_id: req.user.get('id'),
      title: req.body.title,
      category_id: req.body.category,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: !!req.body.published,
      featured: !!req.body.featured
    };

    if (req.files.image_url) {
      postData.image_url = req.files.image_url.name;

      processMyImg('public/temp/' + postData.image_url);
    }

    var tags = processTags(req.body.tags);

    post.save(postData, {updateTags: tags})
    .then(function(model) {
      req.flash('success', { msg: 'Post successfully created.' });
      req.session.clearCache = true;
      res.redirect('/blog/edit/' + model.get('id'));
    })
    .otherwise(function (error) {
      req.flash('error', {msg: 'Post could not be created.'});
      res.redirect('/admin/blog');
    });
  },


  /**
   * POST /blog/edit
   * save blog update
  */
  postEdit: function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('tags', 'Tags must not be empty').notEmpty();
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    var postData = {
      id: req.body.id,
      title: req.body.title,
      category_id: req.body.category,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: !!req.body.published,
      featured: !!req.body.featured
    };

    var options = {method: 'update'};
    var post = new Post({id: postData.id});

    if (req.files.image_url) {
      postData.image_url = req.files.image_url.name;

      processMyImg('public/temp/' + postData.image_url);
    }

    if (req.body.tags) {
      // specify explicitly if you want to update tags
      options.updateTags = processTags(req.body.tags);
    }

    post.fetch()
    .then(function (model) {
      model.save(postData, options)
      .then(function() {
        req.flash('success', { msg: 'Post successfully updated.' });
        res.redirect('back');
      })
      .otherwise(function (error) {
        req.flash('error', {msg: error.message});
        res.redirect('/admin/blog');
      });
    })
    .otherwise(function (error) {
      req.flash('error', {msg: error.message});
      res.redirect('/admin/blog');
    });
  },



  /**
   * GET /blog/delete/:id
   * delete post
  */
  getDelete: function(req, res) {
    var post = new Post();

    post.remove(req.params.id)
    .then(function () {
      req.flash('success', {msg: 'Post successfully deleted.'});
      req.session.clearCache = true;
      res.redirect('back');
    })
    .otherwise(function (error) {
      req.flash('info', {msg: error.message});
      res.redirect('back');
    });
  },



  /**
   * Get /blog/publish/:id
   * (un)publish post
  */
  getPublish: function(req, res) {
    var post = new Post();

    post.togglePublisher(req.params.id)
    .then(function (post) {
      var msg = post.get('published') ? 'published' : 'unpublished';

      req.flash('success', {msg: 'Post successfully ' + msg});
      res.redirect('back');
    })
    .otherwise(function (error) {
      req.flash('info', {msg: error.message});
      res.redirect('back');
    });
  }
};


module.exports = App.controller('Posts', PostsController);

