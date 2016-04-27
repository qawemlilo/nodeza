"use strict";

/**
 * Blog posts collection
**/

const App = require('widget-cms');
const Post = App.getModel('Post');

let Posts = App.Collection.extend({

  model: Post,


  base: '/blog',


  whereQuery: ['published', '=', 1],


  /**
   * Fetches featured front page posts
  */
  featured: function (limit, options) {

    options = options || {};

    let posts = Posts.forge();

    return posts.query((query) => {
      query.limit(limit || this.limit);
      query.where('featured', '=', 1);
      query.andWhere('published', '=', 1);
      query.orderBy('published_at', 'desc');
    })
    .fetch(options)
    .then(function (collection) {
      return collection;
    });
  }
});


module.exports = App.addCollection('Posts', Posts);
