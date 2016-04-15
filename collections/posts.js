"use strict";

/**
 * Blog posts collection
**/

var Base = require('../cms').Bookshelf;
var Post = require('../models/post');

var Posts = Base.Collection.extend({

  model: Post,


  base: '/blog',


  whereQuery: ['published', '=', 1],


  /**
   * Fetches featured front page posts
  */
  featured: function (limit, options) {

    options = options || {};

    var self = this;
    var posts = Posts.forge();

    return posts.query(function (query) {
      query.limit(limit || self.limit);
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


module.exports = Base.collection('Posts', Posts);
