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


  getPosts: async function (req, res) {
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

    try {
      let collection = await posts.fetchBy('id', opts, {withRelated: ['category']});

      res.render('dashboard/posts.hbs', {
        title: 'Posts',
        pagination: posts.pages,
        posts: collection.toJSON(),
        description: 'Node.js tutorials, articles and news',
        page: 'posts',
        query: {},
        layout: 'dashboard-layout.hbs'
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    }
  },


  getNewPost: async function (req, res) {
    try {
      let collection = await Categories.forge().fetch();

      res.render('dashboard/newpost', {
        title: 'New Post',
        description: 'Create a new post',
        page: 'newpost',
        categories: collection.toJSON(),
        layout: 'dashboard-layout.hbs'
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.error});
      next(error)
    }
  },


  getEditPost: async function (req, res) {
    try {
      let categories = await Categories.forge().fetch();
      let post = await Post.forge({id: req.params.id}).fetch({withRelated: ['tags']});

      res.render('dashboard/editpost', {
        page: 'postedit',
        title: 'Post edit',
        description: 'Post edit',
        categories: categories.toJSON(),
        post: post.toJSON(),
        layout: 'dashboard-layout.hbs'
      });
    }
    catch (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    }
  },



  /**
   * POST /dashboard/posts/new
   * save blog post
  */
  createPost: async function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let post = await Post.forge().save({
        user_id: req.user.get('id'),
        title: req.body.title,
        category_id: req.body.category,
        meta_description: req.body.meta_description || req.body.title,
        markdown: req.body.markdown,
        published: !!req.body.published,
        featured: !!req.body.featured
      },
      {
        context: {
          user_id: req.user.get('id')
        },
        updateTags: processTags(req.body.tags)
      });

      req.flash('success', { msg: 'Post successfully created.' });
      res.redirect('/dashboard/posts/edit/' + post.get('id'));
    }
    catch (error) {
      console.error(error.stack);
      req.flash('error', {msg: 'Database error, post not saved.'});
      res.redirect('back');
    }
  },


  /**
   * POST /dashboard/posts/edit/:id
   * save post update
  */
  editPost: async function(req, res, next) {
    req.assert('title', 'Title must be at least 6 characters long').len(6);
    req.assert('tags', 'Tags must not be empty').notEmpty();
    req.assert('markdown', 'Post must be at least 32 characters long').len(32);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
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

      if (req.body.tags) {
        // specify explicitly if you want to update tags
        options.updateTags = processTags(req.body.tags);
      }

      options.context = {
        user_id: req.user.get('id')
      }

      let post = await Post.forge({id: postData.id}).fetch();

      post = await post.save(postData, options);

      req.flash('success', { msg: 'Post successfully updated.' });
      res.redirect('back');
    }
    catch (error) {
      req.flash('error', {msg: error.message});
      next(error);
    }
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
  postAccount: async function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let user = await User.forge({id: req.body.id}).fetch();

      await user.save({
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
      });

      req.flash('success', {msg: 'Account information updated.'});
      res.redirect('back');
    }
    catch (error) {
      req.flash('error', {msg: error.message});
      next(error);
    }
  }
});


module.exports = App.addController('Dashboard', DashboardController);
