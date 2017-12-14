"use strict";

const App = require('widget-cms');
const Posts = App.getCollection('Posts');
const Categories = App.getCollection('Categories');
const Post = App.getModel('Post');
const Category = App.getModel('Category');
const moment = require('moment');
const path =  require('path');
const _ = require('lodash');
const gulpfile = require('../lib/process-images');


function processTags(tags) {
  if (!tags) {
    return [{name: 'uncategorised'}];
  }

  tags = tags.split(',');

  tags = tags.map(function (tag) {
    return {name: tag.trim()};
  });

  return tags;
}


const PostsController = App.Controller.extend({

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
  getPost: function (req, res, next) {
    let slug = req.params.slug;
    let settings = App.getConfig('blog');
    let opts = {slug: slug};

    if (!req.isAuthenticated()) {
      opts.published = 1;
    }

    return Post.forge(opts)
    .fetch({
      withRelated: ['created_by', 'tags', 'category'],
      require: true
    })
    .then(function (post) {
      let author = post.related('created_by').getJSON(['slug', 'name', 'about']);

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
        keywords: _.map(post.related('tags').toJSON(), 'name'),
        post: post.toJSON()
      });

      return post.viewed();
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },



  /*
   * GET /blog/edit/:id
   * edit post form
   */
  getEdit: function (req, res, next) {
    let id = req.params.id;
    let categories = new Categories();

    categories.fetch()
    .then(function (cats) {
      return Post.forge({id: id})
      .fetch({withRelated: ['tags']})
      .then(function (post) {
        res.render('posts/edit', {
          page: 'postedit',
          title: 'Post edit',
          description: 'Post edit',
          categories: cats.toJSON(),
          post: post.toJSON()
        });
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error)
    });
  },


  /**
   * GET /blog
   */
  getBlog: function (req, res, next) {
    let posts = new Posts();
    let currentpage = req.query.p ? parseInt(req.query.p, 10) : 1;
    let settings = App.getConfig('blog');

    res.locals._page = 'blog';

    if (currentpage < 1) {
      res.redirect('/blog');
    }

    posts.fetchBy('published_at', {
      page: currentpage,
      limit: settings.postsPerPage,
      where: ['published_at', '<', new Date()]
    }, {
      columns: ['slug', 'html', 'title', 'category_id', 'published_at','image_url'],
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
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },


  /**
   * GET /blog/category/:slug
   * loads posts by category
  **/
  getBlogCategory: function (req, res, error) {
    let posts = new Posts();
    let slug = req.params.slug;
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let settings = App.getConfig('blog');

    if (currentpage < 1) {
      res.redirect('/blog/category/' + slug);
    }

    Category.forge({slug: slug})
    .fetch({columns: ['id', 'name']})
    .then(function (model) {
      let categoryName  = model.get('name');

      return posts.fetchBy('created_at', {
        limit: settings.postsPerPage,
        page: currentpage,
        andWhere: ['category_id', '=', model.get('id')],
        base:'/blog/category/' + slug
      },
      {
        columns: ['slug', 'html', 'title', 'category_id', 'published_at'],
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
      .catch(function (error) {
        req.flash('errors', {'msg': error.message});
        next(error);
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },



  /**
   * GET /admin/blog
   * get blog posts for current account
   */
  getAdmin: function (req, res, next) {
    let posts = new Posts();
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let role = req.user.related('role').toJSON();
    let opts = {
      limit: 10,
      page: currentpage,
      base: '/admin/blog'
    };

    if (role.name !== 'Super Administrator') {
      opts.where = ['user_id', '=', req.user.get('id')];
    }
    else {
      opts.where = null;
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
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },



  /*
   * GET /blog/new
   * load new blog post form
   */
  getNew: function (req, res, next) {
    let categories = new Categories();

    categories.fetch()
    .then(function (collection) {
      res.render('posts/new', {
        title: 'New Post',
        description: 'Create a new post',
        page: 'newpost',
        categories: collection.toJSON()
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.error});
      next(error)
    });
  },



  /**
   * POST /blog/new
   * save blog post
  */
  postNew: function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('markdown', 'Post must be at least 16 characters long').len(16);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let post = new Post();
    let imagesDir = App.getConfig('imagesDir');

    let postData = {
      user_id: req.user.get('id'),
      title: req.body.title,
      category_id: req.body.category,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: !!req.body.published,
      featured: !!req.body.featured
    };


    if (req.files && req.files.length) {
      postData.image_url = req.files[0].filename;

      setTimeout(function () {
        gulpfile('public/uploads/' + postData.image_url);
      }, 100);
    }

    let tags = processTags(req.body.tags);

    post.save(postData, {
      context: {
        user_id: req.user.get('id')
      },
      updateTags: tags
    })
    .then(function(model) {
      req.flash('success', { msg: 'Post successfully created.' });
      res.redirect('/blog/edit/' + model.get('id'));
    })
    .catch(function (error) {
      console.error(error.stack);
      req.flash('error', {msg: 'Database error, post not saved.'});
      res.redirect('back');
    });
  },


  /**
   * POST /blog/edit
   * save blog update
  */
  postEdit: function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('tags', 'Tags must not be empty').notEmpty();
    req.assert('markdown', 'Post must be at least 16 characters long').len(16);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let postData = {
      id: req.body.id,
      title: req.body.title,
      category_id: req.body.category,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: !!req.body.published,
      featured: !!req.body.featured
    };

    if (req.files && req.files.length) {
      postData.image_url = req.files[0].filename;

      setTimeout(function () {
        gulpfile('public/uploads/' + postData.image_url);
      }, 100);
    }

    let options = {method: 'update'};
    let post = new Post({id: postData.id});

    if (req.body.tags) {
      // specify explicitly if you want to update tags
      options.updateTags = processTags(req.body.tags);
    }

    options.context = {
      user_id: req.user.get('id')
    }

    post.fetch()
    .then(function (model) {
      return model.save(postData, options)
      .then(function(post) {
        req.flash('success', { msg: 'Post successfully updated.' });
        res.redirect('back');
      });
    })
    .catch(function (error) {
      console.error(error.stack);
      req.flash('error', 'Database error, post not saved.');
      res.redirect('back');
    });
  },



  /**
   * GET /blog/delete/:id
   * delete post
  */
  getDelete: function(req, res, next) {
    let post = new Post();

    post.remove(req.params.id)
    .then(function () {
      req.flash('success', {msg: 'Post successfully deleted.'});
      res.redirect('back');
    })
    .catch(function (error) {
      req.flash('info', {msg: error.message});
      next(error);
    });
  },



  /**
   * Get /blog/publish/:id
   * (un)publish post
  */
  getPublish: function(req, res, next) {
    let post = new Post();

    post.togglePublisher(req.params.id)
    .then(function (post) {

      let msg = post.get('published') ? 'published' : 'unpublished';

      req.flash('success', {msg: 'Post successfully ' + msg});
      res.redirect('back');
    })
    .catch(function (error) {
      req.flash('info', {msg: error.message});
      next(error);
    });
  },



  /**
   * Get /blog/featured/:id
   * (un)publish post
  */
  isFeatured: function(req, res, next) {
    Post.forge({id: req.params.id})
    .fetch()
    .then(function (post) {
      let featured = post.get('featured') === 0 ? 1 : 0;

      return post.save({featured: featured});
    })
    .then(function () {
      req.flash('success', {msg: 'Post successfully updated'});
      res.redirect('back');
    })
    .catch(function (error) {
      req.flash('info', {msg: error.message});
      next(error);
    });
  }
});


module.exports = App.addController('Posts', PostsController);
