"use strict";


const App = require('widget-cms');
const Tag = App.getModel('Tag');
const Posts = App.getCollection('Posts');


const TagsController = App.Controller.extend({

  /**
   * GET /blog/tags/:slug
  **/
  getPosts: function (req, res) {
    let slug = req.params.slug;
    let tag = new Tag({slug: slug});
    let page = parseInt(req.query.p, 10);

    // hack for pagination of /blog/tags/:slug
    tag.currentpage = page || 1;
    tag.limit = 2;
    tag.base = '/blog/tags/' + slug;

    tag.fetch()
    .then(function (tag) {

      // first we want to know the total numner of posts
      // with this tag
      tag.total(tag.get('id'))
      .then(function (result) {

        // hack for pagination of /blog/tags/:slug
        let pagination = Posts.prototype.makePages.call(tag, result[0].total);
        let tagname = tag.get('name');

        tag.posts()
        .fetch({
          columns: ['slug', 'html', 'image_url', 'title', 'category_id', 'published_at'],
          withRelated: ['category'],
          limit: 2
        })
        .then(function (collection) {
          res.render('posts/posts', {
            title: 'Blog',
            pagination: pagination,
            posts: collection.toJSON(),
            description: 'Node.js tutorials, articles and news',
            page: 'blog',
            tag: tagname,
            category: '',
            query: {}
          });
        })
        .catch(function (error) {
          req.flash('errors', {'msg': 'Database error.'});
          res.redirect('back');
        });
      })
      .catch(function (error) {
        req.flash('errors', {'msg': 'Database error.'});
        res.redirect('back');
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': 'Database error.'});
      res.redirect('back');
    });
  }
});


module.exports = App.addController('Tags', TagsController);
