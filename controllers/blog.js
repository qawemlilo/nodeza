

var _ = require('lodash');
var Posts = require('../collections/posts');
var Post = require('../models/post');


module.exports = {


  /*
   * GET /blog/:slug
   * loads a blog post by slug
   */
  getPost: function (req, res) {
    var slug = req.params.slug;

    return Post.forge({slug: slug})
    .fetch({withRelated: ['created_by', 'tags']})
    .then(function (post) {
      res.render('post', {
        page: 'post',
        gravatar: post.related('created_by').gravatar(48),
        title: post.get('meta_title'),
        description: post.get('meta_description'),
        page: 'post',
        tags: post.related('tags').toJSON(),
        author: post.related('created_by').toJSON(),
        post: post.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Post not found :('});
      res.redirect('/blog');      
    });
  },



  /**
   * GET /events
   * get upcoming events
   */
  getPosts: function (req, res) {
    var posts = new Posts();
    var page = parseInt(req.query.p, 10);
  
    posts.limit = 5;
    posts.currentpage = page || 1;
  
    posts.fetchItems()
    .then(function (collection) {
      res.render('blog', {
        title: 'Blog',
        pagination: collection.paginated,
        posts: collection.toJSON(),
        description: 'Node.js tutorials, articles and news',
        page: 'blog',
        query: {}
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/');      
    });
  },



  /**
   * GET /events
   * get upcoming events
   */
  newPostsAdmin: function (req, res) {
    var posts = new Posts();
    var page = parseInt(req.query.p, 10);
  
    posts.limit = 5;
    posts.currentpage = page || 1;
    posts.base = '/admin/blog';
    posts.whereQuery = ['user_id', '=', req.user.get('id')];
  
    posts.fetchItems()
    .then(function (items) {
      res.render('blog-admin', {
        title: 'Blog',
        posts: items.models,
        pagination: items.pagination,
        description: 'Node.js tutorials, articles and news',
        page: 'blog',
        query: {}
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('/');      
    });
  },



  /*
   * GET /admin/blog/new
   * load new post page
   */
  newPost: function (req, res) {
    var categories = new Categories();

    categories.fetch()
    .then(function (collection) {
      res.render('newpost', {
        title: 'New Post',
        description: 'Create a new post',
        page: 'newpost',
        categories: collection.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('back');       
    });
  },



  /**
   * POST /admin/blog/new
   * Edit user account.
  */
  postPost: function(req, res, next) {
    var post = new Post();
    var tags = [];

    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    post.tags = req.body.tags;

    post.set({
      user_id: req.user.get('id'),
      title: req.body.title,
      category_id: req.body.category,
      meta_title: req.body.meta_title || req.body.title,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: req.body.published ? 1 : 0,
      featured: req.body.featured ? 1 : 0
    });

    

    post.save()
    .then(function() {
      req.flash('success', { msg: 'Post successfully created.' });
      res.redirect('/blog');
    })
    .otherwise(function (error) {
      req.flash('error', {msg: 'Post could not be created.'});
      console.log(error);
      res.redirect('/blog');
    });
  }
};

