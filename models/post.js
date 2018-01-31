"use strict";

/**
 * Module dependencies.
**/
const App = require('widget-cms');
const Promise  = require('bluebird');
const markdown = require('markdown-it')();
const _ = require('lodash');
const moment = require('moment');


const Post = App.Model.extend({

  tableName: 'posts',


  saved: function(model, attributes, options) {
    if (options.updateTags) {
      return this.updateTags(model, attributes, options);
    }
  },


  hasTimestamps: true,


  tags: function () {
    return this.belongsToMany('Tag');
  },


  created_by: function () {
    return this.belongsTo('User');
  },


  image: function () {
    return this.belongsTo('Image', 'image_id');
  },


  category: function () {
    return this.belongsTo('Category', 'category_id');
  },


  publishingDate: function (fmt) {
    let dt = this.get('_at');

    return moment(dt).format(fmt || 'MMMM D, YYYY');
  },


  saving: function (model, attr, options) {
    if ((this.hasChanged('views') && !this.isNew())) {
      return;
    }


    let html = markdown.render(this.get('markdown'));

    html = html.replace(/&amp;/gi, '&');

    this.set('html', html);
    this.set('title', this.get('title').trim());

    if (this.get('updated_by') && options.context && options.context.user_id) {
      this.set('updated_by', options.context.user_id);
    }

    // set publishing date if published and notExists
    if (this.hasChanged('published') && this.get('published')) {
      if (!this.get('published_at')) {
        this.set('published_at', new Date());
      }
    }

    // set publishing date if published and notExists
    if (this.hasChanged('published') && this.get('published')) {
      if (!this.get('published_at')) {
        this.set('published_at', new Date());
      }
    }

    // if is new or slug has changed and has slug field - generate new slug
    if (!this.get('slug') || this.hasChanged('title')) {
        return this.generateSlug(this.get('title'))
        .then( (slug) => {
          return this.set({slug: slug});
        })
        .then(() => {
          // save article image
          if (options.saveImage) {
            return this.saveImage(options.saveImage)
            .then((img) => {
              return this.set({image_id: img.get('id')});
            });
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    }
    else if (options.saveImage) {
      return this.saveImage(options.saveImage)
      .then((img) => {
        return this.set({image_id: img.get('id')});
      })
      .catch(function (err) {
        console.error(err);
      });
    }
  },


  saveImage: function (opts) {
    let Image = App.getModel('Image');
    let img = new Image(opts);

    return img.save();
  },


  /**
   * Credit: https://github.com/TryGhost/Ghost
   *
   * ### updateTags
   * Update tags that are attached to a post.  Create any tags that don't already exist.
   * @param {Object} newPost
   * @param {Object} attr
   * @param {Object} options
   * @return {Promise(ghostBookshelf.Models.Post)} Updated Post model
  **/
  updateTags: function (newPost, attr, options) {
    let self = this;
    let Tags  = App.getCollection('Tags');
    let Tag  = App.getModel('Tag');

    options = options || {};

    this.myTags = options.updateTags || [];

    return Post.forge({id: newPost.id})
    .fetch({withRelated: ['tags'], transacting: options.transacting})
    .then( (post) => {
      let tagOps = [];

      // remove all existing tags from the post
      // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
      // (https://github.com/tgriesser/bookshelf/issues/294)
      tagOps.push(post.tags().detach(null, _.omit(options, 'query')));

      if (_.isEmpty(this.myTags)) {
        return Promise.all(tagOps);
      }

      return Tags.forge()
      .query('whereIn', 'name', _.map(this.myTags, 'name'))
      .fetch(options)
      .then( (existingTags) => {
        let doNotExist = [];
        let createAndAttachOperation;

        existingTags = existingTags.toJSON() || [];

        doNotExist = _.reject(this.myTags, function (tag) {
          return existingTags.some(function (existingTag) {
              return existingTag.name === tag.name;
          });
        });

        // Create tags that don't exist and attach to post
        _.each(doNotExist, function (tag) {
          createAndAttachOperation = Tag.forge({name: tag.name, description: tag.description}, options).save().then(function (createdTag) {
            createdTag = createdTag.toJSON();

            // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
            // (https://github.com/tgriesser/bookshelf/issues/294)
            return post.tags().attach(createdTag.id, createdTag.name, _.omit(options, 'query'));
          });

          tagOps.push(createAndAttachOperation);
        });

        // attach the tags that already existed
        _.each(existingTags, function (tag) {
          // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
          // (https://github.com/tgriesser/bookshelf/issues/294)
          tagOps.push(post.tags().attach(tag.id, _.omit(options, 'query')));
        });

        return Promise.all(tagOps);
      });
    });
  },



  /*
   * delete post
  **/
  remove: function(id) {
    return Post.forge({id: id})
    .fetch({withRelated: ['tags']})
    .then(function (post) {
      return post.related('tags')
      .detach()
      .then(function () {
        return post.destroy();
      });
    });
  },



  /**
   * toggle publish
  */
  togglePublisher: function(id) {
    return Post.forge({id: id})
    .fetch({withRelated: ['tags']})
    .then(function (post) {
      let published = post.get('published') ? 0 : 1;
      let opts = {};

      opts.published = published;

      return post.save(opts, {patch: true});
    });
  },


  viewed: function () {
    let views = this.get('views') || 0;

    return this.save({'views': views + 1}, {patch: true});
  }

});

module.exports = App.addModel('Post', Post);
