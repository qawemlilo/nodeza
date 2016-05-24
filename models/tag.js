"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');
const knex  = App.Bookshelf.knex;


const Tag =  App.Model.extend({

  tableName: 'tags',

  saving: function (model, attr, options) {
    if (this.get('updated_by') && options.context && options.context.user_id) {
      this.set('updated_by', options.context.user_id);
    }
    
    // if is new or slug has changed and has slug field - generate new slug
    if (!this.get('slug') || this.hasChanged('slug')) {
      return this.generateSlug(this.get('slug') || this.get('name') || this.get('title'))
        .then( (slug) => {
          this.set({slug: slug});
        });
    }

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
  },

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


module.exports = App.addModel('Tag', Tag);
