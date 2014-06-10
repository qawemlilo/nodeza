
var Post = require('../models/post');
var _ = require('lodash');


module.exports = {
  
  /**
   * GET /blog
   * load blog page
  **/
  getBlog: function (req, res) {
    res.render('blog', {
      title: 'Blog',
      description: 'Node.js related articles, tutorials and news',
      page: 'blog'
    });
  },



  /*
   * GET /admin/blog/new
   * load new post page
   */
  newPost: function (req, res) {
    res.render('newpost', {
      title: 'New Post',
      description: 'Create a new post',
      page: 'newpost'
    });
  },


  /**
   * POST /admin/blog/new
   * Edit user account.
  */
  postBlog: function(req, res, next) {
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

