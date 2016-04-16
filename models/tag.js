"use strict";

/**
 * Module dependencies.
 */
var Base = require('widget-cms').Bookshelf;
var knex  = Base.knex;


var Tag =  Base.Model.extend({

  tableName: 'tags',


  // hack for pagination of /blog/tags/:slug
  paginationLimit: 10,


  // hack for pagination of /blog/tags/:slug
  limit: 5,


  // hack for pagination of /blog/tags/:slug
  currentpage: 1,


  hasTimestamps: true,

  // hack for pagination of /blog/tags/:slug
  total: function (tag_id) {
  	return knex('posts_tags').where({
      tag_id: tag_id
  	}).count('post_id AS total');
  },


  posts: function () {
    return this.belongsToMany('Post').query({
    	limit: this.limit,
    	offset: (this.currentpage - 1) * this.limit
    });
  }
});


module.exports = Base.model('Tag', Tag);
