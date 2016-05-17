"use strict";

/**
 * Module dependencies.
**/
const App = require('widget-cms');
const when  = require('when');
const markdown = require('markdown-it')();
const _ = require('lodash');
const moment = require('moment');


const Post = App.Model.extend({

  tableName: 'posts',


  initialize: function () {

    App.Model.prototype.initialize.apply(this, arguments);

    this.on('saved', (model, attributes, options) => {
      if (options.updateTags) {
        this.updateTags(model, attributes, options);
      }
    });
  },


  saving: function (newObj, attr, options) {

    // if only updating views field
    if ((this.hasChanged('views') && !this.isNew()) || this.hasChanged('resetPasswordToken')) {
      return;
    }

    // if updating and has updated_by feild, set it to current user
    if (this.has('updated_by')) {
      self.set('updated_by', user.get('id'));
    }

    App.Model.prototype.saving.apply(this, arguments);
  },


  hasTimestamps: true,


  tags: function () {
    return this.belongsToMany('Tag');
  },


  created_by: function () {
    return this.belongsTo('User');
  },


  category: function () {
    return this.belongsTo('Category', 'category_id');
  },


  publishingDate: function (fmt) {
    let dt = this.get('published_at');

    return moment(dt).format(fmt || 'MMMM D, YYYY');
  },


  saving: function (model, attr, options) {
    let html = markdown.render(this.get('markdown'));

    html = html.replace(/&amp;/gi, '&');

    this.set('html', html);
    this.set('title', this.get('title').trim());

    // set publishing date if published and notExists
    if (this.hasChanged('published') && this.get('published')) {
      if (!this.get('published_at')) {
        this.set('published_at', new Date());
      }
    }

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
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
        return when.all(tagOps);
      }

      return Tags.forge()
      .query('whereIn', 'name', _.pluck(this.myTags, 'name'))
      .fetch(options)
      .then( (existingTags) => {
        let doNotExist = [];
        let createAndAttachOperation;

        existingTags = existingTags.toJSON();

        doNotExist = _.reject(this.myTags, function (tag) {
          return _.any(existingTags, function (existingTag) {
              return existingTag.name === tag.name;
          });
        });

        // Create tags that don't exist and attach to post
        _.each(doNotExist, function (tag) {
          createAndAttachOperation = Tag.forge({name: tag.name}, options).save().then(function (createdTag) {
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

        return when.all(tagOps);
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
      let published = post.get('published') ? false : true;
      let opts = {};

      opts.published = published;

      if(published && !post.get('published_at')) {
        opts.published_at = new Date();
      }

      return post.save(opts, {patch: true});
    });
  }

});

module.exports = App.addModel('Post', Post);
