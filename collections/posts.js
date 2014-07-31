/**
 * Blog posts collection
**/

var when = require('when');
var Base  = require('./base');
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
    var deferred = when.defer();
    var posts = Posts.forge();
    
    posts.query(function (query) {
      query.limit(limit || self.limit);
      query.where('featured', '=', 1);
      query.andWhere('published', '=', 1);
      query.orderBy('published_at', 'desc');
    })
    .fetch(options)
    .then(function (collection) {
      deferred.resolve(collection);
    })
    .otherwise(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }
});


module.exports = Base.collection('Posts', Posts);