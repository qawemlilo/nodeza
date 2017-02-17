"use strict";


const App = require('widget-cms');
const Categories = App.getCollection('Categories');
const Posts = App.getCollection('Posts');
const Post = App.getModel('Post');
const User = App.getModel('User');

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


const DashboardController = App.Controller.extend({

  getDashboard: function (req, res) {
    res.render('dashboard/index', {
      title: 'NodeZA Dashboard',
      description: 'NodeZA Dashboard',
      page: 'dashboard',
      layout: 'dashboard-layout.hbs'
    });
  },


  getPosts: function (req, res) {
    let posts = new Posts();
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let role = req.user.related('role').toJSON();
    let opts = {
      limit: 4,
      page: currentpage,
      base: '/dashboard/posts'
    };

    if (role.name !== 'Super Administrator') {
      opts.where = ['user_id', '=', req.user.get('id')];
    }
    else {
      opts.where = null;
    }

    posts.fetchBy('id', opts, {withRelated: ['category']})
    .then(function (collection) {
      res.render('dashboard/posts.hbs', {
        title: 'Posts',
        pagination: posts.pages,
        posts: collection.toJSON(),
        description: 'Node.js tutorials, articles and news',
        page: 'posts',
        query: {},
        layout: 'dashboard-layout.hbs'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },


  getNewPost: function (req, res) {
    Categories.forge()
    .fetch()
    .then(function (collection) {
      res.render('dashboard/newpost', {
        title: 'New Post',
        description: 'Create a new post',
        page: 'newpost',
        categories: collection.toJSON(),
        layout: 'dashboard-layout.hbs'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.error});
      next(error)
    });
  },


  getEditPost: function (req, res) {
    let id = req.params.id;
    let categories = new Categories();

    categories.fetch()
    .then(function (cats) {
      return Post.forge({id: id})
      .fetch({withRelated: ['tags']})
      .then(function (post) {
        return res.render('dashboard/editpost', {
          page: 'postedit',
          title: 'Post edit',
          description: 'Post edit',
          categories: cats.toJSON(),
          post: post.toJSON(),
          layout: 'dashboard-layout.hbs'
        });
      })
      .catch(function (error) {
        req.flash('errors', {'msg': error.message});
        next(error);
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error)
    });
  },



  /**
   * POST /dashboard/posts/new
   * save blog post
  */
  createPost: function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let post = new Post();

    let postData = {
      user_id: req.user.get('id'),
      title: req.body.title,
      category_id: req.body.category,
      meta_description: req.body.meta_description || req.body.title,
      markdown: req.body.markdown,
      published: !!req.body.published,
      featured: !!req.body.featured
    };

    let tags = processTags(req.body.tags);

    post.save(postData, {
      context: {
        user_id: req.user.get('id')
      },
      updateTags: tags
    })
    .then(function(model) {
      App.clearCache();
      req.flash('success', { msg: 'Post successfully created.' });
      res.redirect('/dashboard/posts/edit/' + model.get('id'));
    })
    .catch(function (error) {
      console.error(error.stack);
      req.flash('error', {msg: 'Database error, post not saved.'});
      res.redirect('back');
    });
  },


  /**
   * POST /dashboard/posts/edit/:id
   * save post update
  */
  editPost: function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('tags', 'Tags must not be empty').notEmpty();
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

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
        App.clearCache();
        req.flash('success', { msg: 'Post successfully updated.' });
        res.redirect('back');
      })
      .catch(function (error) {
        req.flash('error', {msg: error.message});
        next(error);
      });
    })
    .catch(function (error) {
      console.error(error.stack);
      req.flash('error', 'Database error, post not saved.');
      res.redirect('back');
    });
  },


  /**
   * GET /admin/account
   * logged in user account details form.
   */
  getAccount: function (req, res) {

    let tokens = req.user.related('tokens').toJSON();
    let github = tokens.find(function (token) {
        return token.kind === 'github';
    });
    let google = tokens.find(function (token) {
        return token.kind === 'google';
    });
    let twitter = tokens.find(function (token) {
        return token.kind === 'twitter';
    });

    res.render('dashboard/account', {
      title: 'My Account',
      description: 'My account details',
      page: 'account',
      github: github,
      twitter: twitter,
      google: google,
      layout: 'dashboard-layout.hbs'
    });
  },


  /**
   * POST /account
   * Edit user account.
  */
  postAccount: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let details = {
      last_name: req.body.last_name,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      location:req.body.location,
      website: req.body.website,
      twitter_url: req.body.twitter_url,
      github_url: req.body.github_url,
      about: req.body.about,
      updated_by: req.user.get('id')
    };

    User.forge({id: req.body.id})
    .fetch()
    .then(function (user) {
      return user.save(details)
      .then(function() {
        req.flash('success', {msg: 'Account information updated.'});
        res.redirect('back');
      })
      .catch(function (error) {
        req.flash('error', {msg: error.message});
        next(error);
      });
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next(error);
    });
  }
});


module.exports = App.addController('Dashboard', DashboardController);
